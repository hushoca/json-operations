import { ArrayToken, BooleanToken, FalseToken, NullToken, NumberToken, ObjectToken, StringToken, TokenMeta, TrueToken, UsableToken } from "types";

type TokenizeResult = {
    success : false,
    errors : any[]
} | {
    success : true,
    result : UsableToken
}

const numberStartChars = [..."-0123456789"];
const numberMiddleChars = [...".0123456789"];
const whitespaces = [..."\t\r\n "];

class JsonError {
    public constructor(public message : string, public position : number) { }
}

interface ITokenizeStateMachine {
    index : number;
}

export class Tokenizer  implements ITokenizeStateMachine {
    public index : number = 0;
    private char : string;

    private throwError(message : string) {
        throw new JsonError(message, this.index);
    }

    public constructor(private code : string) {
        this.char = code.length > 0 ? code[0] : "";
    }

    private get endOfCode() {
        return this.index == this.code.length - 1;
    }

    private next() {
        if(this.index == this.code.length - 1) throw "Read too much";
        this.char = this.code[++this.index];
    }

    private getMeta(startIndex : number) : TokenMeta  {
        return {
            startIndex,
            endIndex: this.index + 1,
            length: this.index - startIndex + 1
        }
    }

    public optionalNumber() : NumberToken | undefined {
        if(numberStartChars.includes(this.char)) {
            let dotCount = 0;
            let num = this.char;
            let startIndex = this.index;
            while(true) {
                this.next();
                if(this.char == ".") dotCount++;
                if(dotCount == 2) this.throwError("A number can only contain a single '.'");
                num += this.char;
                if(this.endOfCode || !numberMiddleChars.includes(this.code[this.index + 1])) {
                    const token : NumberToken = { 
                        __type: "number", 
                        value: num.includes(".") ? parseFloat(num) : parseInt(num),
                        __meta: this.getMeta(startIndex)
                    }
                    if(!this.endOfCode) this.next();
                    return token;
                }
            }
        }
        return undefined;
    }

    public optionalUnicodeChar() : string | undefined{
        if(this.char == "\\" && !this.endOfCode && this.code[this.index + 1] == "u") {
            let code = "";
            this.next(); //skip \
            this.next(); //skip u
            if(this.index + 4 >= this.code.length) this.throwError("Incomplete unicode character.");
            for(let i = 0; i < 4; i++) {
                code += this.char;
                this.next();
            }
            return String.fromCharCode(parseInt(code, 16));
        }
        return undefined;
    }

    public optionalString() : StringToken | undefined {
        if(this.char == '"') {
            let str = "";
            let startIndex = this.index;
            this.next();
            while(!this.endOfCode || this.char == '"') {
                //@ts-ignore
                if(this.char == "\r" || this.char == "\n") this.throwError("Strings cannot be broken into multiple lines.");
                //@ts-ignore
                if(this.char == "\\") { 
                    const unicodeChar = this.optionalUnicodeChar();
                    if(unicodeChar !== undefined) { 
                        str += unicodeChar;
                        continue;
                    } 
                    this.next();
                    if(this.char == "\\") str += "\\";
                    else if(this.char == '"') str += '"';
                    else if(this.char == "n") str += "\n";
                    else if(this.char == "r") str += "\r";
                    else if(this.char == "t") str += "\t";
                    else str += this.char;
                    this.next();
                    continue;
                }
                if(this.char == '"') {
                    const __meta = this.getMeta(startIndex);
                    if(!this.endOfCode) this.next();
                    return {
                        __type: "string",
                        value: str,
                        __meta
                    }
                }
                str += this.char;
                this.next();
            }
            this.throwError("Unterminated string literal.");
        }
    }

    public optionalWhitespace() {
        let whitespacePresent = false;
        while(whitespaces.includes(this.char) && !this.endOfCode) {
            this.next();
            whitespacePresent = true;
        }
        return whitespacePresent ? { __type: "whitespace" } : undefined;
    }

    public optionalArray() : ArrayToken | undefined {      
        if(this.char == "[") {
            let startIndex = this.index;
            this.next();
            let items : UsableToken[] = [];
            let expectMoreitems = false;
            while(true) {
                //@ts-ignore
                if(this.char == ",") {
                    expectMoreitems = true; 
                    if(this.endOfCode) this.throwError("Expected an item after comma.");
                    this.next();
                    continue;
                }
                //@ts-ignore
                if(this.char == "]") {
                    if(expectMoreitems) this.throwError("Expected an item after comma.");
                    const __meta = this.getMeta(startIndex);
                    if(!this.endOfCode) this.next();
                    return {
                        __type: "array",
                        items,
                        __meta
                    }
                }
                if(this.endOfCode) this.throwError("Unterminated array.");

                const token = this.optionalWhitespace() ?? this.optionalBoolean() ?? this.optionalNull() ?? 
                                this.optionalNumber() ?? this.optionalString() ?? this.optionalObject() ?? 
                                this.optionalArray() ?? this.throwError(`Unknown character at ${this.index}`);                          
                if(token?.__type == "whitespace") continue;
                //@ts-ignore
                items.push(token);
                expectMoreitems = false;
            }
        }
        return undefined;
    }

    public optionalNull() : NullToken | undefined {
        if(this.char == "n") {
            const startIndex = this.index;
            if(this.endOfCode) throw this.throwError(`Invalid character at ${startIndex}.`);
            this.next();
            //@ts-ignore
            if(this.char != "u" || this.endOfCode) throw this.throwError(`Invalid character at ${startIndex}.`); 
            this.next();
            //@ts-ignore
            if(this.char != "l" || this.endOfCode) throw this.throwError(`Invalid character at ${startIndex}.`); 
            this.next();            
            //@ts-ignore
            if(this.char != "l") throw this.throwError(`Invalid character at ${startIndex}.`); 
            const __meta = this.getMeta(startIndex);
            if(!this.endOfCode) this.next();
            return {
                __type: "null",
                value: null,
                __meta
            }
        }
        return undefined;
    }

    public optionalTrue() : TrueToken | undefined {
        if(this.char == "t") {
            const startIndex = this.index;
            if(this.endOfCode) throw this.throwError(`Invalid character at ${startIndex}.`);
            this.next();
            //@ts-ignore
            if(this.char != "r" || this.endOfCode) throw this.throwError(`Invalid character at ${startIndex}.`); 
            this.next();
            //@ts-ignore
            if(this.char != "u" || this.endOfCode) throw this.throwError(`Invalid character at ${startIndex}.`); 
            this.next();            
            //@ts-ignore
            if(this.char != "e") throw this.throwError(`Invalid character at ${startIndex}.`); 
            const __meta = this.getMeta(startIndex);
            if(!this.endOfCode) this.next();
            return {
                __type: "true",
                value: true,
                __meta
            }
        }
        return undefined;
    }

    public optionalFalse() : FalseToken | undefined {
        if(this.char == "f") {
            const startIndex = this.index;
            if(this.endOfCode) throw this.throwError(`Invalid character at ${startIndex}.`);
            this.next();
            //@ts-ignore
            if(this.char != "a" || this.endOfCode) throw this.throwError(`Invalid character at ${startIndex}.`); 
            this.next();
            //@ts-ignore
            if(this.char != "l" || this.endOfCode) throw this.throwError(`Invalid character at ${startIndex}.`); 
            this.next();            
            //@ts-ignore
            if(this.char != "s" || this.endOfCode) throw this.throwError(`Invalid character at ${startIndex}.`); 
            this.next();            
            //@ts-ignore
            if(this.char != "e") throw this.throwError(`Invalid character at ${startIndex}.`); 
            const __meta = this.getMeta(startIndex);
            if(!this.endOfCode) this.next();
            return {
                __type: "false",
                value: false,
                __meta
            }
        }
        return undefined;
    }    

    public optionalBoolean() : BooleanToken | undefined {
       const trueOrFalse = this.optionalTrue() ?? this.optionalFalse();
       if(!trueOrFalse) return undefined;
       return {
            __meta: trueOrFalse.__meta,
            __type: "boolean",
            value: trueOrFalse.value
       }
    }

    public optionalObject() : ObjectToken | undefined {
        //TODO
        return undefined;
    }

}

const tokenize =  function(json : string) : TokenizeResult {
    let i = 0;
    let line = 0;
    let column = 0;
    // throw "Not yet implemented!";
    return { success: false, errors: [ "xd" ] }
}

export default tokenize;