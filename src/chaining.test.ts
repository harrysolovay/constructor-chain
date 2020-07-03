import {IsExact, assert} from "conditional-type-checks";
import {Chainable} from ".";

describe("chains with statics preserved", () => {
  it("base class", () => {
    expect.assertions(6);

    const A = Chainable(
      class {
        static readonly a = "a";
      },
    );
    assert<IsExact<typeof A.a, "a">>(true);
    expect(A.a).toStrictEqual("a");

    const B = A.next({
      b: "b" as const,
    });
    assert<IsExact<typeof B.a, "a">>(true);
    expect(B.a).toStrictEqual("a");
    assert<IsExact<typeof B.b, "b">>(true);
    expect(B.b).toStrictEqual("b");

    const C = B.next({
      c: "c" as const,
    });
    assert<IsExact<typeof C.a, "a">>(true);
    expect(B.b).toStrictEqual("b");
    assert<IsExact<typeof C.b, "b">>(true);
    expect(B.b).toStrictEqual("b");
    assert<IsExact<typeof C.c, "c">>(true);
    expect(B.b).toStrictEqual("b");
  });

  it("subclass", () => {
    expect.assertions(3);

    const A = Chainable(
      class extends Number {
        static readonly a = "a";

        constructor(value: number) {
          super(value);
        }
      },
    );
    assert<IsExact<typeof A.a, "a">>(true);
    assert<IsExact<"a" | "next" | keyof typeof Number, keyof typeof A>>(true);
    expect(A.a).toStrictEqual("a");

    const B = A.next({
      b: "b" as const,
    });
    assert<IsExact<typeof B.a, "a">>(true);
    assert<IsExact<typeof B.b, "b">>(true);
    assert<IsExact<"a" | "b" | "next" | keyof typeof Number, keyof typeof B>>(
      true,
    );
    expect(B.a).toStrictEqual("a");
    expect(B.b).toStrictEqual("b");
  });
});
