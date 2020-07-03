import {Chainable} from "../src";

class BaseString extends Chainable(
  class extends String {
    constructor(value: string) {
      super(value);
    }
  },
) {}

class StringA extends BaseString.next({
  a: "a" as const,
}) {}

class StringB extends StringA.next({
  b: "b" as const,
  logA() {
    console.log(this.a);
  },
}) {}

class StringC extends StringB.next({
  c: "c" as const,
  logABC() {
    this.logA();
    console.log(this.b, this.c);
  },
}) {}

StringC.logABC();
