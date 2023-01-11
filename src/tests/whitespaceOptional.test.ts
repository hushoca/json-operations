import { Tokenizer } from "../tokenize";
import { describe, expect, it } from "vitest";

describe("whitespaceOptional", () => {

    it("should ignore non whitespace", () => {
        const tokenizer = new Tokenizer(`"test 123"`);
        expect(tokenizer.optionalWhitespace()).toStrictEqual(undefined);
        expect(tokenizer.index).eq(0);
    })

    it("should ignore skip spaces", () => {
        const tokenizer = new Tokenizer(`    "test 123"`);
        expect(tokenizer.optionalWhitespace()).toStrictEqual(undefined);
        expect(tokenizer.index).eq(4);
    })

    it("should ignore skip tabs", () => {
        const tokenizer = new Tokenizer(`\t\t\t\t"test 123"`);
        expect(tokenizer.optionalWhitespace()).toStrictEqual(undefined);
        expect(tokenizer.index).eq(4);
    })

    it("should ignore skip \r\n", () => {
        const tokenizer = new Tokenizer(`\r\n"test 123"`);
        expect(tokenizer.optionalWhitespace()).toStrictEqual(undefined);
        expect(tokenizer.index).eq(2);
    })

    it("should skip all the way to the end of the code without throwing\r\n", () => {
        const tokenizer = new Tokenizer(`    \r\n \t`);
        expect(tokenizer.optionalWhitespace()).toStrictEqual(undefined);
        expect(tokenizer.index).eq(7);
    })

})