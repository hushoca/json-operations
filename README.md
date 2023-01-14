# json-operations (WIP)

Json operations is my attempt at writing a way of parsing, tokenizing and generally working with JSON that can be used on browsers/node etc while having a standard error schema. If you are after simple parsing I recommend still using JSON.parse().

I was building something that required for me to raise errors when JSON was invalid and identify where it was broken, I couldn't find a library that I liked that did it (and JSON.parse() throws different errors on each browser). So I wrote this library

# Installation
```
npm install json-operations
```

# Tokenization

```ts
import { tokenize } from "json-operations"

const token = tokenize(`{"foo":"bar"}`);

if(token.success == true) {
    console.log(token.result);
} else {
    console.err(token.errors[0]);
}
```

TODO: Expand this bit more, explain it bit more

## Errors
The following error messages might come out of tokenize function:

* Invalid character
* Incomplete unicode character
* Strings cannot be spread over multiple lines
* Unterminated string literal
* Unterminated array		
* Commas should be followed by items within arrays	
* Invalid property name (property names can only be strings)		
* Unterminated object
* Commas should be followed by more properties within objects

JsonTokenizeError has the following format:
```ts
{
    public message : string; //error message (possible values listed above)
    public position : number; //index of the character that triggered the error
    public line : number; //current line (based on \n)
    public column : number; //current index of the character within the line
}
```