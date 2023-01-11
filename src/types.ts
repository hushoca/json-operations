export interface TokenMeta {
    startIndex : number;
    endIndex : number;
    length : number;
}

//indicates token types that can be used for array values or object property values
export type UsableToken = StringToken | NumberToken | ObjectToken | ArrayToken;

export interface StringToken {
    __meta : TokenMeta;
    __type : "string",
    value : string;
}

export interface NumberToken {
    __meta : TokenMeta;
    __type : "number";
    value : number; 
}

export interface PropertyToken {
    __meta : TokenMeta;
    __type : "property",
    name : string;
    value : UsableToken;
}

export interface ObjectToken {
    __meta : TokenMeta;
    __type : "object";
    properties : PropertyToken[]
}

export interface ArrayToken {
    __meta : TokenMeta;
    __type : "array";
    items : UsableToken[]
}