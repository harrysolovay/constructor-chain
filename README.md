## Constructor Chain

[![npm version](https://img.shields.io/npm/v/constructor-chain.svg?style=flat-square)](https://badge.fury.io/js/constructor-chain) ![license](https://img.shields.io/npm/l/constructor-chain.svg?style=flat-square) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/harrysolovay/constructor-chain/blob/master/CONTRIBUTING.md#submitting-pull-requests) [![Build Status](https://img.shields.io/travis/harrysolovay/constructor-chain.svg?style=flat-square)](https://travis-ci.org/harrysolovay/constructor-chain) [![downloads](https://img.shields.io/npm/dm/constructor-chain.svg?style=flat-square)](https://www.npmjs.com/package/constructor-chain)

**"Chainables" enable chain-style extension of class statics in TypeScript.**

Compared with `class extends` syntax, Chainables are a lighter mechanism for composition of metadata within constructors. The goal is to allow TypeScript library developers to treat constructors as more of a first-class data type. For libraries which aim to track state in user-provided constructors, this pattern is indispensible.

- **Chain Statics onto Constructors** Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
- **Reduce Boilerplate** Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
- **Typesafe, with both CJS & ESM builds** Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

## Show Me The Code!

### Installation

**Deno** users can reference from the GitHub source.

`import-map.json`

```json
{
  "imports": {
    "constructor-chain": "https://raw.githubusercontent.com/harrysolovay/constructor-chain/master/src/index.ts"
  }
}
```

**Node** users can install with [npm](http://npmjs.org/)

```sh
npm install constructor-chain
```

### Basic Usage

```ts
import {Chainable} from "constructor-chain";

const A = Chainable(
  class {
    readonly a = "hello";
  },
);

A.a; // type "hello"
new A(); // instance of `A`

const B = A.next({
  b: "chainable",
} as const);

B.a; // type "hello"
B.b; // type "chainable"
new B(); // instance of `B`
```

## Usage Continued

Let's say we're building a validation library, which accepts a custom `String` constructor. Our validation library expects for the constructor to chain metadata about its constraints in the form of static props. This validation metadata could includ `minLength`, `maxLength`, `forbiddenChars`, ... the list goes on.

First, we'll define our base constructor, which extends `String`.

```ts
class OurString extends String {
  constructor(value: string) {
    super(value);
  }
}
```

Next, we'll extend from `OurString` to encode validation metadata onto our constructors.

```ts
class MinLengthString extends OurString {
  static readonly minLength = 8;
}

class MaxLengthString extends OurString {
  static readonly maxLength = 20;
}

class ForbiddenChars extends OurString {
  static readonly forbiddenChars = ["*", ")", ":"];
}
```

If we want to then recombine these static fields in new constructors, this becomes tedios. We end up writing a lot more than the Chainable equivalent:

```ts
import {Chainable} from "constructor-chain";

const CString = Chainable(OurString);

const MinLengthString = CString.with({minLength: 8} as const);
const MaxLengthString = CString.with({maxLength: 20} as const);
const ForbiddenCharsString = CString.with({
  forbiddenChars: ["*", ")", ":"],
} as const);
```

And of course, these are all valid constructors.

```ts
const minLengthString = new MinLengthString("min length string"); // string
const maxLengthString = new MaxLengthString("max length string"); // string
const forbiddenCharsString = new ForbiddenCharsString("forbidden chars string"); // string
```

Let's now abstract over Chainables with metadata-returning helpers.

```ts
import {OurString} from "./base-class"; // the constructor you wish make chainable
import {minLength, maxLength, forbiddenChars} from "./helpers"; // your metadata factories

const CString = Chainable(OurString);

const MinLengthString = CString.with(minLength(8));
const MaxLengthString = CString.with(maxLength(20));
const ForbiddenCharsString = CString.with(forbiddenChars(["*", ")", ":"]));
```

The chainable constructors can be used to produce new constructors. This enhances the composability of creating new constructors with differing variations of statics.

```ts
const MinLengthString = CString.with(minLength(8));
const MinMaxLengthString = MinLengthString.with(maxLength(20));
```

### License

This library is licensed under [the Apache 2.0 License](LICENSE).
