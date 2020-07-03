import { IsExact, assert } from "conditional-type-checks";
import { Chainable } from ".";

describe("next key", () => {
  it("Default", () => {
    expect.assertions(0);
    const Result = Chainable(String);
    assert<IsExact<"next" | keyof typeof String, keyof typeof Result>>(true);
  });

  it("Custom", () => {
    expect.assertions(0);
    const Result = Chainable(Date, "sweet");
    assert<IsExact<"sweet" | keyof typeof Date, keyof typeof Result>>(true);
  });
});
