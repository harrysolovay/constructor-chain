# Constructor Chain

[![npm version](https://img.shields.io/npm/v/constructor-chain.svg?style=flat-square)](https://badge.fury.io/js/constructor-chain) ![license](https://img.shields.io/npm/l/constructor-chain.svg?style=flat-square) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/harrysolovay/constructor-chain/blob/master/CONTRIBUTING.md#submitting-pull-requests) [![Build Status](https://img.shields.io/travis/harrysolovay/constructor-chain.svg?style=flat-square)](https://travis-ci.org/harrysolovay/constructor-chain) [![downloads](https://img.shields.io/npm/dm/constructor-chain.svg?style=flat-square)](https://www.npmjs.com/package/constructor-chain)

**"Chainables" enable chain-style extension of class statics in TypeScript.**

Compared with `class extends` syntax, chainables are a lighter mechanism for composition of metadata within constructors. The goal is to allow TypeScript library developers to treat constructors as more of a first-class data type. This pattern can serve libraries which aim to track state in user-provided constructors.

## Getting Started

### Installation

**Deno** users can reference the GitHub source directly.

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

> `constructor-chain` is packaged in both ESM & CJS formats, alongside its type definitions.

### Basic Usage

```ts
import { Chainable } from "constructor-chain";

const A = Chainable(
  class {
    static readonly a = "Hello";
  },
);

A.a; // type `"hello"`
new A(); // instance of `A`

const B = A.next({
  b: "chainables",
} as const);

B.a; // type `"hello"`
B.b; // type `"chainable"`
new B(); // instance of `B` (subtype of `A`)

const C = B.next({
  staticsToString() {
    // we can reference inherited statics with `this`
    return `${this.a} ${this.b}!`;
  },
});

C.staticsToString(); // `Hello chainables!`
new C(); // instance of `C` (subtype of `B`)
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

If we want to then recombine these static fields in new constructors, this becomes tedious. We end up writing a lot more than the chainable equivalent:

**GOOD**

```ts
import { Chainable } from "constructor-chain";

const CString = Chainable(OurString);

const MinLengthString = CString.next({ minLength: 8 } as const);
const MaxLengthString = CString.next({ maxLength: 20 } as const);
const ForbiddenCharsString = CString.next({
  forbiddenChars: ["*", ")", ":"],
} as const);
```

These all remain valid constructors.

```ts
new MinLengthString("min length string"); // type `string`
new MaxLengthString("max length string"); // type `string`
new ForbiddenCharsString("forbidden chars string"); // type `string`
```

Let's now abstract over chainables with a few helpers.

```ts
import { OurString } from "./base-class"; // the constructor you wish make chainable
import { minLength, maxLength, forbiddenChars } from "./helpers"; // your metadata factories

const CString = Chainable(OurString);

const MinLengthString = CString.next(minLength(8));
const MaxLengthString = CString.next(maxLength(20));
const ForbiddenCharsString = CString.next(forbiddenChars(["*", ")", ":"]));
```

We can pass metadata down the chain as well.

```ts
const MinLengthString = CString.next(minLength(8));
const MinMaxLengthString = MinLengthString.next(maxLength(20));
```

The chainable constructors can be used to produce new constructors. Statics are represented as an intersection of the initial constructor and a recursive object type, generic over the chain; this representation allows us to overcome the thoughtful, yet sometimes annoying limitations of static properties in TypeScript.

For instance, one cannot write the following without producing TS error 1166 (`A computed property name in a class property declaration must refer to an expression whose type is a literal type or a 'unique symbol'`).

**BAD**

```ts
class Base {}

const keys = ["a", "b", "c"] as const;

const [A, B, C] = keys.map((e) => {
  return class extends Base {
    static [e] = e;
  };
});
```

Let's see how chainables make this possible, without producing a compile error.

**GOOD**

```ts
const Base = Chainable(class {});

const keys = ["a", "b", "c"] as const;

const [A, B, C] = keys.map((e) => Base.next({ [e]: e }));
```

**Caveat**

```ts
A.a; // type `any`
new A();

B.b; // type `any`
new B();

C.c; // type `any`
new C();
```

## Nooks & Crannies

### `this` Context

When providing statics to the `next` method, the `this` context (the aggregate of the chain's contexts) is available.

```ts
const A = Chainable(
  class {
    static readonly fqn = "j3$1Ks";
  },
);

const B = A.next({
  printFqn() {
    console.log(this.fqn);
  },
});

B.printFqn(); // logs out "j3$1Ks"
```

### Supplying a Custom Next Key

To supplement an alternative method name for `next`, pass the desired name as the second argument of `Chainable`.

```ts
const A = Chainable(
  class {
    static readonly first = "first";
  },
  "proceed",
);

// `proceed` instead of `next`
const B = A.proceed({
  second: "second",
} as const);
```

### Note

It's my humble belief that its alright if it's unclear how a piece of technology will be used. This library was built primarily out of enjoyment of the process, and its use cases are a secondary consideration. I do believe the `Chainable` type has its place, but who knows? TypeScript's statics are unusual beasts: chainables allow us to represent them without actually making use of the type system's representation of statics. This enables us to tackle more composition patterns without those gruesome red squiglies (in addition to reducing inheritance boilerplate). If you have a use case in mind, or feedback more generally, please do reach out––I'd love to hear from you!

### License

This library is licensed under [the Apache 2.0 License](LICENSE).
