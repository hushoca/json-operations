import { Tokenizer } from "../tokenize";
import { describe, expect, it } from "vitest"

describe("optionalNumber", () => {
    it("should work with negative numbers", () => {
        const tokenizer = new Tokenizer(`-1`);
        expect(tokenizer.optionalNumber()).toStrictEqual({ 
            __type: "number", 
            value: -1,
            __meta: {
                endIndex: 2,
                length: 2,
                startIndex: 0,
            },
        });
    })

    it("should work with positive numbers", () => {
        const tokenizer = new Tokenizer(`1123`);
        expect(tokenizer.optionalNumber()).toStrictEqual({ 
            __type: "number", 
            value: 1123,
            __meta: {
                endIndex: 4,
                length: 4,
                startIndex: 0,
            },
        });
    })

    it("should work with fractional numbers", () => {
        const tokenizer = new Tokenizer(`0.255`);
        expect(tokenizer.optionalNumber()).toStrictEqual({ 
            __type: "number", 
            value: 0.255,
            __meta: {
                endIndex: 5,
                length: 5,
                startIndex: 0,
            },
        });
    })

    it("should work with negative fractional numbers", () => {
        const tokenizer = new Tokenizer(`-0.1`);
        expect(tokenizer.optionalNumber()).toStrictEqual({ 
            __type: "number", 
            value: -0.1,
            __meta: {
                endIndex: 4,
                length: 4,
                startIndex: 0,
            },
        });
    })

    it("should not with strings", () => {
        const tokenizer = new Tokenizer(`"123"`);
        expect(tokenizer.optionalNumber()).toStrictEqual(undefined);
    })

    it("should not work with invalid fractionals", () => {
        const tokenizer = new Tokenizer(`.025`);
        expect(tokenizer.optionalNumber()).toStrictEqual(undefined);
    });

    it("should not work with invalid fractionals (multiple dots)", () => {
        const tokenizer = new Tokenizer(`0.2.5`);
        expect(() => tokenizer.optionalNumber()).throws("Invalid character");
    });

    it("should parse as much as it can [space break]", () => {
        const tokenizer = new Tokenizer(`21212 5`);
        expect(tokenizer.optionalNumber()).toStrictEqual({ 
            __type: "number", 
            value: 21212,
            __meta: {
                endIndex: 5,
                length: 5,
                startIndex: 0,
            },
        });
    });

    it("should parse as much as it can [new line break]", () => {
        const tokenizer = new Tokenizer(`21212\n5`);
        expect(tokenizer.optionalNumber()).toStrictEqual({ 
            __type: "number", 
            value: 21212,
            __meta: {
                endIndex: 5,
                length: 5,
                startIndex: 0,
            },
        });
    });

    it("should parse as much as it can [string line break]", () => {
        const tokenizer = new Tokenizer(`21212a5`);
        expect(tokenizer.optionalNumber()).toStrictEqual({ 
            __type: "number", 
            value: 21212,
            __meta: {
                startIndex: 0,
                endIndex: 5,
                length: 5,
            },
        });
    });

    it("should ignore leading zeros in value (but not in __meta)", () => {
        const tokenizer = new Tokenizer(`0000001`);
        expect(tokenizer.optionalNumber()).toStrictEqual({ 
            __type: "number", 
            value: 1,
            __meta: {
                endIndex: 7,
                length: 7,
                startIndex: 0,
            },
        });
    });
})