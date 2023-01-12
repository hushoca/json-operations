import { Tokenizer } from "../tokenize";
import { describe, expect, it } from "vitest";

describe("optionalString", () => {
    it("should parse string", () => {
        const tokenizer = new Tokenizer(`"test 123"`);
        expect(tokenizer.optionalString()).toStrictEqual({
            __type : "string",
            value: "test 123",
            __meta: {
                startIndex: 0,
                endIndex : 10,
                length: 10
            }
        });
    })

    it("should parse string with spaces ", () => {
        const tokenizer = new Tokenizer(`"str\\ning with\\tspaces"`);
        expect(tokenizer.optionalString()).toStrictEqual({
            __type : "string",
            value: "str\ning with\tspaces",
            __meta: {
                startIndex: 0,
                endIndex : 23,
                length: 23
            }
        });
    })

    it("should not destroy random escaped chars ", () => {
        const tokenizer = new Tokenizer(`"d\\ad"`);
        expect(tokenizer.optionalString()).toStrictEqual({
            __type : "string",
            value: "dad",
            __meta: {
                startIndex: 0,
                endIndex : 6,
                length: 6
            }
        });
    })


    it('should parse string with escaped double quote (") ', () => {
        const tokenizer = new Tokenizer(`"hello \\"there\\""`);
        expect(tokenizer.optionalString()).toStrictEqual({
            __type : "string",
            value: 'hello "there"',
            __meta: {
                startIndex: 0,
                endIndex : 17,
                length: 17
            }
        });
    })

    it("should parse string with unicode characters ", () => {
        const tokenizer = new Tokenizer(`"31\\u00b0C"`);
        expect(tokenizer.optionalString()).toStrictEqual({
            __type : "string",
            value: "31°C",
            __meta: {
                startIndex: 0,
                endIndex : 11,
                length: 11
            }
        });
    })

    it("should not parse string with new line [\\n]", () => {
        const tokenizer = new Tokenizer(`"string with\nspaces"`);
        expect(() => tokenizer.optionalString()).toThrow("Strings cannot be broken into multiple lines.");
    })

    it("should not parse string with new line [\\r]", () => {
        const tokenizer = new Tokenizer(`"string with\rspaces"`);
        expect(() => tokenizer.optionalString()).toThrow("Strings cannot be broken into multiple lines.");
    })

})