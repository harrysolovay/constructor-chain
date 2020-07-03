import { IsExact, assert } from "conditional-type-checks";
import { Chainable } from ".";

describe("chains with this context", () => {
  it("basic", () => {
    expect.assertions(16);

    const A = Chainable(
      class {
        static readonly a = "a";
      },
    );
    assert<IsExact<typeof A.a, "a">>(true);
    expect(A.a).toStrictEqual("a");

    const B = A.next({
      b: "b" as const,
      getA() {
        return this.a;
      },
    });
    assert<IsExact<typeof B.a, "a">>(true);
    assert<IsExact<typeof B.b, "b">>(true);
    expect(B.a).toStrictEqual("a");
    expect(B.b).toStrictEqual("b");
    expect(B.getA()).toStrictEqual("a");

    const C = B.next({
      c: "c" as const,
      getAB() {
        return [this.a, this.b];
      },
    });
    assert<IsExact<typeof C.a, "a">>(true);
    assert<IsExact<typeof C.b, "b">>(true);
    assert<IsExact<typeof C.c, "c">>(true);
    expect(C.a).toStrictEqual("a");
    expect(C.b).toStrictEqual("b");
    expect(C.c).toStrictEqual("c");
    expect(C.getA()).toStrictEqual("a");
    expect(C.getAB()).toStrictEqual(["a", "b"]);

    const D = C.next({
      d: "d" as const,
      getABCD() {
        return [this.a, this.b, this.c, this.d];
      },
    });
    assert<IsExact<typeof D.a, "a">>(true);
    assert<IsExact<typeof D.b, "b">>(true);
    assert<IsExact<typeof D.c, "c">>(true);
    assert<IsExact<typeof D.d, "d">>(true);
    expect(D.a).toStrictEqual("a");
    expect(D.b).toStrictEqual("b");
    expect(D.c).toStrictEqual("c");
    expect(D.d).toStrictEqual("d");
    expect(D.getA()).toStrictEqual("a");
    expect(D.getAB()).toStrictEqual(["a", "b"]);
    expect(D.getABCD()).toStrictEqual(["a", "b", "c", "d"]);
  });
});
