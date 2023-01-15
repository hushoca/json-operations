import { tokenize } from "../tokenize";
import { describe, expect, it } from "vitest";
import { JsonTokenizeError } from "../types";

describe("tokenize", () => {

    it("should work with string", () => {
        const result = tokenize(`"test 123"`);
        expect(result).toStrictEqual({
            success: true,
            result: {
                __type: "string",
                value: "test 123",
                __meta: {
                    startIndex: 0,
                    endIndex: 10,
                    length: 10
                }
            }
        });
    })

    it("should work with string (with whitespaces around)", () => {
        const result = tokenize(`   "test 123"\t`);
        expect(result).toStrictEqual({
            success: true,
            result: {
                __type: "string",
                value: "test 123",
                __meta: {
                    startIndex: 3,
                    endIndex: 13,
                    length: 10
                }
            }
        });
    })

    it("should work with numbers (with whitespace at the start)", () => {
        const result = tokenize(`   1.31`);
        expect(result).toStrictEqual({
            success: true,
            result: {
                __type: "number",
                value: 1.31,
                __meta: {
                    startIndex: 3,
                    endIndex: 7,
                    length: 4
                }
            }
        });
    })

    it("should work with null (with whitespace at the end)", () => {
        const result = tokenize(`null\t\t\n   `);
        expect(result).toStrictEqual({
            success: true,
            result: {
                __type: "null",
                value: null,
                __meta: {
                    startIndex: 0,
                    endIndex: 4,
                    length: 4
                }
            }
        });
    })

    it("should work with bools (true, with whitespace at the end)", () => {
        const result = tokenize(`true\t\t\n   `);
        expect(result).toStrictEqual({
            success: true,
            result: {
                __type: "boolean",
                value: true,
                __meta: {
                    startIndex: 0,
                    endIndex: 4,
                    length: 4
                }
            }
        });
    })

    it("should work with bools (false, with whitespace at the start)", () => {
        const result = tokenize(`\t\n\t  false`);
        expect(result).toStrictEqual({
            success: true,
            result: {
                __type: "boolean",
                value: false,
                __meta: {
                    startIndex: 5,
                    endIndex: 10,
                    length: 5
                }
            }
        });
    })

    it("should work with arrays (false, with whitespace at the start)", () => {
        const result = tokenize(`\t\n\t  false`);
        expect(result).toStrictEqual({
            success: true,
            result: {
                __type: "boolean",
                value: false,
                __meta: {
                    startIndex: 5,
                    endIndex: 10,
                    length: 5
                }
            }
        });
    })

    it("should error with invalid syntax", () => {
        expect(tokenize("a")).toStrictEqual({ success: false, errors: [
            new JsonTokenizeError("Invalid character", 0, 0, 0)
        ]})
    })

    it("should error with invalid syntax (with whitespace)", () => {
        expect(tokenize("     a")).toStrictEqual({ success: false, errors: [
            new JsonTokenizeError("Invalid character", 5, 0, 5)
        ]})
    })

    it("should error with invalid syntax (with multiline)", () => {
        expect(tokenize("   \n  a")).toStrictEqual({ success: false, errors: [
            new JsonTokenizeError("Invalid character", 6, 1, 2)
        ]})
    })

    it("should error with invalid syntax (with multiline + whitespace after)", () => {
        expect(tokenize("   \n  a   ")).toStrictEqual({ success: false, errors: [
            new JsonTokenizeError("Invalid character", 6, 1, 2)
        ]})
    })

})