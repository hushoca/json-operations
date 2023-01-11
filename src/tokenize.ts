import { NumberToken, StringToken, TokenMeta, UsableToken } from "types";

type TokenizeResult = {
    success : false,
    errors : any[]
} | {
    success : true,
    result : UsableToken
}

// export function numberToken(value : string, optional : true) : NumberToken | null;
// export function numberToken(value : string, optional: false | undefined) : NumberToken;
// export function numberToken(value : string, optional? : boolean) : any {
//     if(optional && value.)
// }

const numberStartChars = [..."-0123456789"];
const numberMiddleChars = [...".0123456789"];
const whitespaces = [..."\t\r\n "];

class JsonError {
    public constructor(public message : string, public position : number) { }
}

interface ITokenizeStateMachine {
    index : number;
}

export class Tokenizer  implements ITokenizeStateMachine{
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

    public optionalNumber() {//: NumberToken | undefined {
        if(numberStartChars.includes(this.char)) {
            let dotCount = 0;
            let num = this.char;
            let startIndex = this.index;
            while(true) {
                this.next();
                if(this.char == ".") dotCount++;
                if(dotCount == 2) this.throwError("A number can only contain a single '.'");
                num += this.char;
                if(!numberMiddleChars.includes(this.char) || this.endOfCode) {
                    return { 
                        __type: "number", 
                        value: num.includes(".") ? parseFloat(num) : parseInt(num),
                        __meta: this.getMeta(startIndex)
                    }
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
            for(let i = 0; i < 3; i++) {
                code += this.char;
                this.next();
            }
            code += this.char;
            return String.fromCharCode(parseInt(code, 16));
        }
        return undefined;
    }

    public optionalString() : StringToken | undefined {
        if(this.char == '"') {
            let str = "";
            let startIndex = this.index;
            while(!this.endOfCode) {
                this.next();
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
                    continue;
                }
                if(this.char == '"') return {
                    __type: "string",
                    value: str,
                    __meta: this.getMeta(startIndex)
                }
                str += this.char;
            }
            this.throwError("Unterminated string literal!");
        }
    }

    public optionalWhitespace() : undefined {
        while(whitespaces.includes(this.char) && !this.endOfCode) {
            this.next();
        }
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