import { Tokenizer } from "../tokenize";
import { describe, expect, it } from "vitest"

describe("optionalArray", () => {

    it("should work with empty arrays", () => {
        const tokenizer = new Tokenizer(`[]`);
        expect(tokenizer.optionalArray()).toStrictEqual({ 
            __type: "array", 
            items: [],
            __meta: {
                startIndex: 0,
                endIndex: 2,
                length: 2,
            },
        });
    })

    it("should work with empty arrays (with whitespace)", () => {
        const tokenizer = new Tokenizer(`[ \t\r\n]`);
        expect(tokenizer.optionalArray()).toStrictEqual({ 
            __type: "array", 
            items: [],
            __meta: {
                startIndex: 0,
                endIndex: 6,
                length: 6,
            },
        });
    })

    it("should work with single number", () => {
        const tokenizer = new Tokenizer(`[-123.4]`);
        expect(tokenizer.optionalArray()).toStrictEqual({ 
            __type: "array", 
            items: [
                {
                    __type: "number",
                    value: -123.4,
                    __meta: {
                        startIndex: 1,
                        endIndex: 7,
                        length: 6
                    }
                }
            ],
            __meta: {
                startIndex: 0,
                endIndex: 8,
                length: 8,
            },
        });
    })

    it("should work with multiple numbers", () => {
        const tokenizer = new Tokenizer(`[-123.4, 31]`);
        expect(tokenizer.optionalArray()).toStrictEqual({ 
            __type: "array", 
            items: [
                {
                    __type: "number",
                    value: -123.4,
                    __meta: {
                        startIndex: 1,
                        endIndex: 7,
                        length: 6
                    }
                },
                {
                    __type: "number",
                    value: 31,
                    __meta: {
                        startIndex: 9,
                        endIndex: 11,
                        length:2
                    }
                },
            ],
            __meta: {
                startIndex: 0,
                endIndex: 12,
                length: 12,
            },
        });
    })

    it("should work with multiple strings", () => {
        const tokenizer = new Tokenizer(`["abc"\t,\r\n"efg 123"]`);
        expect(tokenizer.optionalArray()).toStrictEqual({ 
            __type: "array", 
            items: [
                {
                    __type: "string",
                    value: "abc",
                    __meta: {
                        startIndex: 1,
                        endIndex: 6,
                        length: 5
                    }
                },
                {
                    __type: "string",
                    value: "efg 123",
                    __meta: {
                        startIndex: 10,
                        endIndex: 19,
                        length: 9
                    }
                },
            ],
            __meta: {
                startIndex: 0,
                endIndex: 20,
                length: 20,
            },
        });
    })

    it("should work with strings, numbers, booleans & nulls ", () => {
        const tokenizer = new Tokenizer(`["abc", 20, true, false, null]`);
        expect(tokenizer.optionalArray()).toStrictEqual({ 
            __type: "array", 
            items: [
                {
                    __type: "string",
                    value: "abc",
                    __meta: {
                        startIndex: 1,
                        endIndex: 6,
                        length: 5
                    }
                },
                {
                    __type: "number",
                    value: 20,
                    __meta: {
                        startIndex: 8,
                        endIndex: 10,
                        length: 2
                    }
                },
                {
                    __type: "boolean",
                    value: true,
                    __meta: {
                        startIndex: 12,
                        endIndex: 16,
                        length: 4
                    }
                },
                {
                    __type: "boolean",
                    value: false,
                    __meta: {
                        startIndex: 18,
                        endIndex:  23,
                        length: 5
                    }
                },
                {
                    __type: "null",
                    value: null,
                    __meta: {
                        startIndex: 25,
                        endIndex: 29,
                        length: 4
                    }
                },
            ],
            __meta: {
                startIndex: 0,
                endIndex: 30,
                length: 30,
            },
        });
    })

    it("should work with arrays inside arrays ", () => {
        const tokenizer = new Tokenizer(`[[69]]`);
        expect(tokenizer.optionalArray()).toStrictEqual({ 
            __type: "array", 
            items: [
                { 
                    __type: "array", 
                    items: [
                        {
                            __type: "number",
                            value: 69,
                            __meta: {
                                startIndex: 2,
                                endIndex: 4,
                                length: 2
                            }
                        }
                    ],
                    __meta: {
                        startIndex: 1,
                        endIndex: 5,
                        length: 4,
                    },
                }
            ],
            __meta: {
                startIndex: 0,
                endIndex: 6,
                length: 6,
            },
        });
    })

    it("should work with objects inside arrays ", () => {
        const tokenizer = new Tokenizer(`[{"age":1.5}]`);
        expect(tokenizer.optionalArray()).toStrictEqual({ 
            __type: "array", 
            items: [
                { 
                    __type: "object", 
                    properties: [
                        {
                            __type: "property",
                            name: {
                                __type: "string",
                                value: "age",
                                __meta: {
                                    startIndex: 2,
                                    endIndex: 7,
                                    length: 5
                                }
                            },
                            value: {
                                __type: "number",
                                value: 1.5,
                                __meta: {
                                    startIndex: 8,
                                    endIndex: 11,
                                    length: 3
                                }
                            },
                            __meta: {
                                startIndex: 2,
                                endIndex: 11,
                                length: 9
                            }
                        }
                    ],
                    __meta: {
                        startIndex: 1,
                        endIndex: 12,
                        length: 11
                    },
                }
            ],
            __meta: {
                startIndex: 0,
                endIndex: 13,
                length: 13
            },
        });
    })

    it("should error when left incomplete (without comma)", () => {
        const tokenizer = new Tokenizer(`[ "test"`);
        expect(() => tokenizer.optionalArray()).toThrow("Unterminated array");
    })

    it("should error when left incomplete (with comma)", () => {
        const tokenizer = new Tokenizer(`[ "test", `);
        expect(() => tokenizer.optionalArray()).toThrow("Unterminated array");
    })

    it("should return undefined when not array", () => {
        const tokenizer = new Tokenizer(`true`);
        expect(tokenizer.optionalArray()).toStrictEqual(undefined);
    })

})