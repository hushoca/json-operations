import { 
    ArrayToken, BooleanToken, FalseToken, JsonTokenizeError, NullToken, 
    NumberToken, ObjectToken, PropertyToken, StringToken, 
    TokenMeta, TrueToken, UsableToken 
} from "types";

type TokenizeResult = {
    success : false,
    errors : JsonTokenizeError[]
} | {
    success : true,
    result : UsableToken | undefined
}

const numberStartChars = [..."-0123456789"];
const numberMiddleChars = [...".0123456789"];
const whitespaces = [..."\t\r\n "];

export class Tokenizer {
    public index : number = 0;
    public line : number = 0;
    public column : number = 0;
    private char : string;

    public throwError(message : string) {
        throw new JsonTokenizeError(message, this.index, this.line, this.column);
    }

    public constructor(private code : string) {
        this.char = code.length > 0 ? code[0] : "";
    }

    public get endOfCode() {
        return this.index == this.code.length - 1;
    }

    private next() {
        if(this.index == this.code.length - 1) throw "Read too much";
        this.char = this.code[++this.index];
        if(this.char == "\n") {
            this.line++;
            this.column = 0;
        } else {
            this.column++;
        }
    }

    private getMeta(startIndex : number, endIndex : number = this.index + 1) : TokenMeta  {
        return {
            startIndex,
            endIndex,
            length: endIndex - startIndex
        }
    }

    public optionalNumber() : NumberToken | undefined {
        if(numberStartChars.includes(this.char)) {
            let dotCount = 0;
            let num = "";
            let startIndex = this.index;
            while(true) {
                if(this.char == ".") dotCount++;
                if(dotCount == 2) this.throwError("Invalid character");
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
                this.next();
            }
        }
        return undefined;
    }

    public optionalUnicodeChar() : string | undefined{
        if(this.char == "\\" && !this.endOfCode && this.code[this.index + 1] == "u") {
            let code = "";
            this.next(); //skip \
            this.next(); //skip u
            if(this.index + 4 >= this.code.length) this.throwError("Incomplete unicode character");
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
                if(this.char == "\r" || this.char == "\n") this.throwError("Strings cannot be spread over multiple lines");
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
            this.throwError("Unterminated string literal");
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
            if(this.endOfCode) this.throwError("Unterminated array");
            this.next();
            let items : UsableToken[] = [];
            let expectMoreitems = false;
            while(true) {
                //@ts-ignore
                if(this.char == ",") {
                    expectMoreitems = true; 
                    if(this.endOfCode) this.throwError("Commas should be followed by items within arrays");
                    this.next();
                    continue;
                }
                //@ts-ignore
                if(this.char == "]") {
                    if(expectMoreitems) this.throwError("Commas should be followed by items within arrays");
                    const __meta = this.getMeta(startIndex);
                    if(!this.endOfCode) this.next();
                    return {
                        __type: "array",
                        items,
                        __meta
                    }
                }
                if(this.endOfCode) this.throwError("Unterminated array");

                const token = this.optionalWhitespace() ?? this.optionalBoolean() ?? this.optionalNull() ?? 
                                this.optionalNumber() ?? this.optionalString() ?? this.optionalObject() ?? 
                                this.optionalArray() ?? this.throwError(`Invalid character`);                          
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
            if(this.endOfCode) throw this.throwError(`Invalid character`);
            this.next();
            //@ts-ignore
            if(this.char != "u" || this.endOfCode) throw this.throwError(`Invalid character`); 
            this.next();
            //@ts-ignore
            if(this.char != "l" || this.endOfCode) throw this.throwError(`Invalid character`); 
            this.next();            
            //@ts-ignore
            if(this.char != "l") throw this.throwError(`Invalid character`); 
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
            if(this.endOfCode) throw this.throwError(`Invalid character`);
            this.next();
            //@ts-ignore
            if(this.char != "r" || this.endOfCode) throw this.throwError(`Invalid character`); 
            this.next();
            //@ts-ignore
            if(this.char != "u" || this.endOfCode) throw this.throwError(`Invalid character`); 
            this.next();            
            //@ts-ignore
            if(this.char != "e") throw this.throwError(`Invalid character`); 
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
            if(this.endOfCode) throw this.throwError(`Invalid character`);
            this.next();
            //@ts-ignore
            if(this.char != "a" || this.endOfCode) throw this.throwError(`Invalid character`); 
            this.next();
            //@ts-ignore
            if(this.char != "l" || this.endOfCode) throw this.throwError(`Invalid character`); 
            this.next();            
            //@ts-ignore
            if(this.char != "s" || this.endOfCode) throw this.throwError(`Invalid character`); 
            this.next();            
            //@ts-ignore
            if(this.char != "e") throw this.throwError(`Invalid character`); 
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

    public expectProperty() : PropertyToken | undefined {
        let startIndex = this.index;
        const name = this.optionalString();
        if(name == undefined) this.throwError("Invalid property name (property names can only be strings)"); 
        this.optionalWhitespace();
        if(this.char !== ":") this.throwError(`Invalid character`);
        this.next();
        this.optionalWhitespace();
        const value = this.optionalBoolean() ?? this.optionalNull() ?? this.optionalNumber() ?? 
                        this.optionalString() ?? this.optionalObject() ?? this.optionalArray();
        if(value === undefined) this.throwError(`Invalid character`);
        return {
            __meta: this.getMeta(startIndex, this.index),
            __type: "property",
            name: name!,
            value: value!
        } 
    }

    private optionalComma() {
        if(this.char == ",") { 
            this.next();
            return { __type: "comma" }
        }
    }

    public optionalObject() : ObjectToken | undefined {
        if(this.char == "{") {
            let startIndex = this.index;
            if(this.endOfCode) this.throwError("Unterminated object");
            this.next();
            let expectMoreProperties = false;
            let properties : PropertyToken[] = []
            //@ts-ignore
            while(!this.endOfCode || this.char == "}") {
                //@ts-ignore
                if(this.char == "}") {
                    if(expectMoreProperties) this.throwError("Commas should be followed by more properties within objects");
                    const __meta = this.getMeta(startIndex);
                    if(!this.endOfCode) this.next();
                    return {
                        __meta,
                        __type: "object",
                        properties
                    }
                }
                const token = this.optionalWhitespace() ?? this.optionalComma() ?? this.expectProperty();
                if(token?.__type == "whitespace") continue;
                if(token?.__type == "comma") { 
                    if(properties.length == 0) this.throwError("Invalid character");
                    expectMoreProperties = true;
                    continue;
                }
                properties.push(token as PropertyToken);
                expectMoreProperties = false;
            }
            this.throwError("Unterminated object")
        }
        return undefined;
    }

}

type TokenizeOptions = { throwError?: boolean }
const tokenize = function(json : string, opts : TokenizeOptions = { throwError: false }) : TokenizeResult {
    const tokenizer = new Tokenizer(json);
    try {
        tokenizer.optionalWhitespace();
        const result = tokenizer.optionalString() ?? tokenizer.optionalNumber() ?? tokenizer.optionalBoolean() ??
                        tokenizer.optionalNull() ?? tokenizer.optionalArray() ?? tokenizer.optionalObject();
        tokenizer.optionalWhitespace();
        if(!tokenizer.endOfCode) {
            throw tokenizer.throwError(`Invalid character`);
        }
        return { success: true, result }
    } catch(e : any) {
        if(e instanceof JsonTokenizeError) {
            if(opts.throwError) throw e;
            return { success: false, errors: [ e ] };
        }
        throw "Unexpected error: " + JSON.stringify(e);
    }
}

export default tokenize;