import { Tokenizer } from "../tokenize";
import { describe, expect, it } from "vitest";
import { JsonTokenizeError } from "types";

describe("optionalObject", () => {

    it("should work with empty objects", () => {
        const tokenizer = new Tokenizer(`{}`);
        const result = tokenizer.optionalObject();
        expect(result).toStrictEqual({
            __type: "object",
            properties: [],
            __meta: {
                startIndex: 0,
                endIndex: 2,
                length: 2
            }
        });
    })

    it("should error when a half complete property is present", () => {
        const tokenizer = new Tokenizer(`{"":`);
        expect(() => tokenizer.optionalObject()).toThrow("Invalid character");
    })

    it("should work with empty objects (with whitespace)", () => {
        const tokenizer = new Tokenizer(`{ }`);
        const result = tokenizer.optionalObject();
        expect(result).toStrictEqual({
            __type: "object",
            properties: [],
            __meta: {
                startIndex: 0,
                endIndex: 3,
                length: 3
            }
        });
    })

    //TODO
    it("should work with objects with single properties", () => {
        const tokenizer = new Tokenizer(`{"test":123}`);
        const result = tokenizer.optionalObject();
        expect(result).toStrictEqual({
            __type: "object",
            properties: [{
                __type: "property",
                name: {
                    __type: "string",
                    value: "test",
                    __meta: {
                        startIndex: 1,
                        endIndex: 7,
                        length: 6
                    }
                },
                value: {
                    __type: "number",
                    value: 123,
                    __meta: {
                        startIndex: 8,
                        endIndex: 11,
                        length: 3
                    }
                },
                __meta: {
                    startIndex: 1,
                    endIndex: 11,
                    length: 10
                }
            }],
            __meta: {
                    startIndex: 0,
                    endIndex: 12,
                    length: 12
            }
        });
    })

    it("should work with numbers, strings, booleans, nulls and array as property values (without whitespace)", () => {
        const tokenizer = new Tokenizer(`{"1":1,"2":"str","3":null,"4":[]}`);
        const result = tokenizer.optionalObject();
        expect(result).toStrictEqual({
            __type: "object",
            properties: [
                {
                    __type: "property",
                    name: {
                        __type: "string",
                        value: "1",
                        __meta: {
                            startIndex: 1,
                            endIndex: 4,
                            length: 3
                        }
                    },
                    value: {
                        __type: "number",
                        value: 1,
                        __meta: {
                            startIndex: 5,
                            endIndex: 6,
                            length: 1
                        }
                    },
                    __meta: {
                        startIndex: 1,
                        endIndex: 6,
                        length: 5
                    }
                },
                {
                    __type: "property",
                    name: {
                        __type: "string",
                        value: "2",
                        __meta: {
                            startIndex: 7,
                            endIndex: 10,
                            length: 3
                        }
                    },
                    value: {
                        __type: "string",
                        value: "str",
                        __meta: {
                            startIndex: 11,
                            endIndex: 16,
                            length: 5
                        }
                    },
                    __meta: {
                        startIndex: 7,
                        endIndex: 16,
                        length: 9
                    }
                },
                {
                    __type: "property",
                    name: {
                        __type: "string",
                        value: "3",
                        __meta: {
                            startIndex: 17,
                            endIndex: 20,
                            length: 3
                        }
                    },
                    value: {
                        __type: "null",
                        value: null,
                        __meta: {
                            startIndex: 21,
                            endIndex: 25,
                            length: 4
                        }
                    },
                    __meta: {
                        startIndex: 17,
                        endIndex: 25,
                        length: 8 
                    }
                },
                {
                    __type: "property",
                    name: {
                        __type: "string",
                        value: "4",
                        __meta: {
                            startIndex: 26,
                            endIndex: 29,
                            length: 3
                        }
                    },
                    value: {
                        __type: "array",
                        items: [],
                        __meta: {
                            startIndex: 30,
                            endIndex: 32,
                            length: 2
                        }
                    },
                    __meta: {
                        startIndex: 26,
                        endIndex: 32,
                        length: 6
                    }
                }
            ],
            __meta: {
                startIndex: 0,
                endIndex: 33,
                length: 33
            }
        });
    })

    it("should work with numbers, strings, booleans, nulls and array as property values", () => {
        const tokenizer = new Tokenizer(`{ "1" : 1 , "2" : "str" , "3" : null, "4" :   [] }   `);
        const result = tokenizer.optionalObject();
        expect(result).toStrictEqual({
            __type: "object",
            properties: [
                {
                    __type: "property",
                    name: {
                        __type: "string",
                        value: "1",
                        __meta: {
                            startIndex: 2,
                            endIndex: 5,
                            length: 3
                        }
                    },
                    value: {
                        __type: "number",
                        value: 1,
                        __meta: {
                            startIndex: 8,
                            endIndex: 9,
                            length: 1
                        }
                    },
                    __meta: {
                        startIndex: 2,
                        endIndex: 9,
                        length: 7
                    }
                },
                {
                    __type: "property",
                    name: {
                        __type: "string",
                        value: "2",
                        __meta: {
                            startIndex: 12,
                            endIndex: 15,
                            length: 3
                        }
                    },
                    value: {
                        __type: "string",
                        value: "str",
                        __meta: {
                            startIndex: 18,
                            endIndex: 23,
                            length: 5
                        }
                    },
                    __meta: {
                        startIndex: 12,
                        endIndex: 23,
                        length: 11
                    }
                },
                {
                    __type: "property",
                    name: {
                        __type: "string",
                        value: "3",
                        __meta: {
                            startIndex: 26,
                            endIndex: 29,
                            length: 3
                        }
                    },
                    value: {
                        __type: "null",
                        value: null,
                        __meta: {
                            startIndex: 32,
                            endIndex: 36,
                            length: 4
                        }
                    },
                    __meta: {
                        startIndex: 26,
                        endIndex: 36,
                        length: 10
                    }
                },
                {
                    __type: "property",
                    name: {
                        __type: "string",
                        value: "4",
                        __meta: {
                            startIndex: 38,
                            endIndex: 41,
                            length: 3
                        }
                    },
                    value: {
                        __type: "array",
                        items: [],
                        __meta: {
                            startIndex: 46,
                            endIndex: 48,
                            length: 2
                        }
                    },
                    __meta: {
                        startIndex: 38,
                        endIndex: 48,
                        length: 10
                    }
                }
            ],
            __meta: {
                startIndex: 0,
                endIndex: 50,
                length: 50
            }
        });
    })

    it("should work with objects in objects (with whitespace)", () => {
        const tokenizer = new Tokenizer(`{ "test": { } }`);
        const result = tokenizer.optionalObject();
        expect(result).toStrictEqual({
            __type: "object",
            properties: [{
                __type: "property",
                name: {
                    __type: "string",
                    value: "test",
                    __meta: {
                        startIndex: 2,
                        endIndex: 8,
                        length: 6
                    }
                },
                value: {
                    __type: "object",
                    properties: [],
                    __meta: {
                        startIndex: 10,
                        endIndex: 13,
                        length: 3
                    }
                },
                __meta: {
                    startIndex: 2,
                    endIndex: 13,
                    length: 11
                }
            }],
            __meta: {
                startIndex: 0,
                endIndex: 15,
                length: 15
            }
        });
    })

    it("should work with objects in objects (without whitespace)", () => {
        const tokenizer = new Tokenizer(`{"test":{}}`);
        const result = tokenizer.optionalObject();
        expect(result).toStrictEqual({
            __type: "object",
            properties: [{
                __type: "property",
                name: {
                    __type: "string",
                    value: "test",
                    __meta: {
                        startIndex: 1,
                        endIndex: 7,
                        length: 6
                    }
                },
                value: {
                    __type: "object",
                    properties: [],
                    __meta: {
                        startIndex: 8,
                        endIndex: 10,
                        length: 2
                    }
                },
                __meta: {
                    startIndex: 1,
                    endIndex: 10,
                    length: 9
                }
            }],
            __meta: {
                startIndex: 0,
                endIndex: 11,
                length: 11
            }
        });
    })

    it("should error when a unfinished object is received (with spaces)", () => {
        const tokenizer = new Tokenizer(`{  `);
        expect(() => tokenizer.optionalObject()).toThrow("Unterminated object");
    })

    it("should error when a unfinished object is received", () => {
        const tokenizer = new Tokenizer(`{`);
        expect(() => tokenizer.optionalObject()).toThrow("Unterminated object");
    })

})