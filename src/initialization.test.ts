import { IsExact, assert } from "conditional-type-checks";
import { Chainable } from ".";

describe("statics preserved when initializing with built-in constructors", () => {
  it("String", () => {
    expect.assertions(0);
    const Result = Chainable(String, "next");
    assert<IsExact<"next" | keyof typeof String, keyof typeof Result>>(true);
  });

  it("Date", () => {
    expect.assertions(0);
    const Result = Chainable(Date, "next");
    assert<IsExact<"next" | keyof typeof Date, keyof typeof Result>>(true);
  });
});

describe("statics preserved when initializing with subclass", () => {
  it("Boolean-extended", () => {
    expect.assertions(0);
    const Result = Chainable(
      class extends Boolean {
        static readonly id = "boolean-subclass";

        constructor(value: boolean) {
          super(value);
        }
      },
    );
    assert<IsExact<"next" | "id" | keyof typeof Boolean, keyof typeof Result>>(
      true,
    );
    assert<IsExact<typeof Result["id"], "boolean-subclass">>(true);
  });

  it("Number-extended", () => {
    expect.assertions(0);
    const Result = Chainable(
      class extends Number {
        static readonly id = "number-subclass";

        constructor(value: number) {
          super(value);
        }
      },
    );
    assert<IsExact<"next" | "id" | keyof typeof Number, keyof typeof Result>>(
      true,
    );
    assert<IsExact<typeof Result["id"], "number-subclass">>(true);
  });
});
