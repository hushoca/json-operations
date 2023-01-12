export interface TokenMeta {
    startIndex : number;
    endIndex : number;
    length : number;
}

//indicates token types that can be used for array values or object property values
export type UsableToken = StringToken | NumberToken | ObjectToken | ArrayToken | BooleanToken | NullToken;

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

export interface NullToken {
    __meta : TokenMeta;
    __type : "null";
    value : null;
}

export interface TrueToken {
    __meta : TokenMeta;
    __type : "true";
    value : true;
}

export interface FalseToken {
    __meta : TokenMeta;
    __type : "false";
    value : false;
}

export interface BooleanToken {
    __meta : TokenMeta;
    __type : "boolean";
    value : boolean;
}

export interface PropertyToken {
    __meta : TokenMeta;
    __type : "property",
    name : StringToken;
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