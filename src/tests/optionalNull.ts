import { Tokenizer } from "../tokenize";
import { describe, expect, it } from "vitest"

describe("optionalNull", () => {

    it("should work with true", () => {
        const tokenizer = new Tokenizer(`null`);
        expect(tokenizer.optionalNumber()).toStrictEqual({ 
            __type: "null", 
            value: null,
            __meta: {
                startIndex: 0,
                endIndex: 4,
                length: 4
            },
        });
    })
    
    it("should return undefined when not null", () => {
        const tokenizer = new Tokenizer(`undefined`);
        expect(tokenizer.optionalBoolean()).toStrictEqual(undefined);
    })

    it("should error when left unfinished", () => {
        const tokenizer = new Tokenizer(`nul`);
        expect(() => tokenizer.optionalBoolean()).throw("Invalid character at 0.");
    })
})