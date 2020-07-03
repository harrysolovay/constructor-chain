# Constructor Chain

[![npm version](https://img.shields.io/npm/v/constructor-chain.svg?style=flat-square)](https://badge.fury.io/js/constructor-chain) ![license](https://img.shields.io/npm/l/constructor-chain.svg?style=flat-square) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/harrysolovay/constructor-chain/blob/master/CONTRIBUTING.md#submitting-pull-requests) [![Build Status](https://img.shields.io/travis/harrysolovay/constructor-chain.svg?style=flat-square)](https://travis-ci.org/harrysolovay/constructor-chain) [![downloads](https://img.shields.io/npm/dm/constructor-chain.svg?style=flat-square)](https://www.npmjs.com/package/constructor-chain)

**"Chainables" enable chain-style extension of class statics in TypeScript.**

Compared with `class extends` syntax, chainables are a lighter mechanism for composition of metadata within constructors. The goal is to allow TypeScript library developers to treat constructors as more of a first-class data type. This pattern can serve libraries which aim to track state in user-provided constructors.

## Show Me The Code!

### Installation

**Deno** users can reference from the GitHub source.

`import_map.json`

```json
{
  "imports": {
    "constructor-chain": "https://raw.githubusercontent.com/harrysolovay/constructor-chain/master/src/index.ts"
  }
}
```

**Node** users can install with [npm](https://www.npmjs.com/package/constructor-chain).

```sh
npm install constructor-chain
```

### Basic Usage

```ts
import {Chainable} from "constructor-chain";

const A = Chainable(
  class {
    readonly a = "Hello";
  },
);

A.a; // type "hello"
new A(); // instance of `A`

const B = A.next({
  b: "chainables",
} as const);

B.a; // type "hello"
B.b; // type "chainable"
new B(); // instance of `B`

const C = B.next({
  staticsToString() {
    // we can reference inherited statics with `this`
    return `${this.a} ${this.b}!`;
  },
});

C.staticsToString(); // `Hello chainables!`
```

## Usage Continued

Let's say we're building a validation library which accepts a custom `String` constructor. Our validation library expects for the constructor to contain metadata about its constraints in the form of static props. This validation metadata could include `minLength`, `maxLength`, `forbiddenChars`, ... the list goes on.

First, we'll define our base constructor, which extends `String`.

```ts
class OurString extends String {
  constructor(value: string) {
    super(value);
  }
}
```

Under normal (non-chainable) circumstances, we would extend from `OurString` to encode validation metadata onto our constructors.

**BAD**

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

However, if we want to then recombine these static fields in new constructors, this becomes tedios. We end up writing a lot more than the chainable equivalent:

**GOOD**

```ts
import {Chainable} from "constructor-chain";

const CString = Chainable(OurString);

const MinLengthString = CString.next({minLength: 8} as const);
const MaxLengthString = CString.next({maxLength: 20} as const);
const ForbiddenCharsString = CString.next({
  forbiddenChars: ["*", ")", ":"],
} as const);
```

These all remain valid constructors.

```ts
new MinLengthString("min length string"); // string
new MaxLengthString("max length string"); // string
new ForbiddenCharsString("forbidden chars string"); // string
```

Let's now abstract over chainables with a few helpers.

```ts
import {OurString} from "./base-class"; // the constructor you wish make chainable
import {minLength, maxLength, forbiddenChars} from "./helpers"; // your metadata factories

const CString = Chainable(OurString);

const MinLengthString = CString.next(minLength(8));
const MaxLengthString = CString.next(maxLength(20));
const ForbiddenCharsString = CString.next(forbiddenChars(["*", ")", ":"]));
```

The chainable constructors can be used to produce new constructors. This enhances the composability of creating new constructors with differing variations of statics.

```ts
const MinLengthString = CString.next(minLength(8));
const MinMaxLengthString = MinLengthString.next(maxLength(20));
```

## Nooks & Crannies

### `this` Context

When providing statics to the `next` method, the `this` context is available.

```ts
const A = Chainable(
  class {
    readonly fqn = "j3$1Ks";
  },
);

const B = A.next({
  printFqn() {
    console.log(fqn);
  },
});

B.printFqn(); // logs out "j3$1Ks"
```

### Supplying a Custom Next Key

To supplement an alternative method name for `next`, pass the desired name as the second argument of `Chainable`.

```ts
const A = Chainable(
  class {
    readonly first = "first";
  },
  "proceed",
);

// `proceed` instead of `next`
const B = A.proceed({
  second: "second",
} as const);
```

### Note

Often in programming, its unclear how a piece of technology will be used. TypeScript's type system has advanced far beyond that of any other language, perhaps with the exception of Scala 3 (according to my collaborator & mentor [Sam Goodwin](https://github.com/sam-goodwin)). That being said, TypeScript's statics are odd beasts: this library could be described as **virtualizing the composition of statics**. How exactly this will aid in anyone's fight against current limitations of the TypeScript compiler, I do not know. If you have a use case in mind, or feedback more generally, please do reach out! Thank you!

### License

This library is licensed under [the Apache 2.0 License](LICENSE).
