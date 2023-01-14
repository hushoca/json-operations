import { Tokenizer } from "../tokenize";
import { describe, expect, it } from "vitest"

describe("optionalBoolean", () => {

    it("should work with true", () => {
        const tokenizer = new Tokenizer(`true`);
        expect(tokenizer.optionalBoolean()).toStrictEqual({ 
            __type: "boolean", 
            value: true,
            __meta: {
                startIndex: 0,
                endIndex: 4,
                length: 4
            },
        });
    })

    it("should work with false", () => {
        const tokenizer = new Tokenizer(`false`);
        expect(tokenizer.optionalBoolean()).toStrictEqual({ 
            __type: "boolean", 
            value: false,
            __meta: {
                startIndex: 0,
                endIndex: 5,
                length: 5
            },
        });
    })

    it("should return undefined when not boolean", () => {
        const tokenizer = new Tokenizer(`True`);
        expect(tokenizer.optionalBoolean()).toStrictEqual(undefined);
    })

    it("should error when left unfinished (true)", () => {
        const tokenizer = new Tokenizer(`tru`);
        expect(() => tokenizer.optionalBoolean()).throws("Invalid character");
    })

    it("should error when left unfinished (false)", () => {
        const tokenizer = new Tokenizer(`fals`);
        expect(() => tokenizer.optionalBoolean()).throws("Invalid character");
    })
})