import { Tokenizer } from "../tokenize";
import { describe, expect, it } from "vitest"

describe("numberToken", () => {
    it("should work with negative numbers", () => {
        const stateMachine = new Tokenizer(`-1`);
        expect(stateMachine.optionalNumber()).toStrictEqual({ 
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
        const stateMachine = new Tokenizer(`1123`);
        expect(stateMachine.optionalNumber()).toStrictEqual({ 
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
        const stateMachine = new Tokenizer(`0.255`);
        expect(stateMachine.optionalNumber()).toStrictEqual({ 
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
        const stateMachine = new Tokenizer(`-0.1`);
        expect(stateMachine.optionalNumber()).toStrictEqual({ 
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
        const stateMachine = new Tokenizer(`"123"`);
        expect(stateMachine.optionalNumber()).toStrictEqual(undefined);
    })

    it("should not work with invalid fractionals", () => {
        const stateMachine = new Tokenizer(`.025`);
        expect(stateMachine.optionalNumber()).toStrictEqual(undefined);
    });

    it("should not work with invalid fractionals (multiple dots)", () => {
        const stateMachine = new Tokenizer(`0.2.5`);
        expect(() => stateMachine.optionalNumber()).throws("A number can only contain a single '.'");
    });

    it("should parse as much as it can [space break]", () => {
        const stateMachine = new Tokenizer(`21212 5`);
        expect(stateMachine.optionalNumber()).toStrictEqual({ 
            __type: "number", 
            value: 21212,
            __meta: {
                endIndex: 6,
                length: 6,
                startIndex: 0,
            },
        });
    });

    it("should parse as much as it can [new line break]", () => {
        const stateMachine = new Tokenizer(`21212\n5`);
        expect(stateMachine.optionalNumber()).toStrictEqual({ 
            __type: "number", 
            value: 21212,
            __meta: {
                endIndex: 6,
                length: 6,
                startIndex: 0,
            },
        });
    });

    it("should parse as much as it can [string line break]", () => {
        const stateMachine = new Tokenizer(`21212a5`);
        expect(stateMachine.optionalNumber()).toStrictEqual({ 
            __type: "number", 
            value: 21212,
            __meta: {
                startIndex: 0,
                endIndex: 6,
                length: 6,
            },
        });
    });

    it("should ignore leading zeros in value (but not in __meta)", () => {
        const stateMachine = new Tokenizer(`0000001`);
        expect(stateMachine.optionalNumber()).toStrictEqual({ 
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