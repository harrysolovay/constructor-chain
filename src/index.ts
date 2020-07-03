interface Members {
  [key: string]: unknown;
}

type Constructor<Args extends unknown[], Return extends unknown> = new (
  ...args: Args
) => Return;

type AnyConstructor = Constructor<any[], any>;

/**
 * A representation of a constructor and its recursively-defined parent relationships
 * and its `next` method (potentially supplied a different key).
 */
type Chainable<
  Source extends AnyConstructor,
  NextKey extends string,
  LastMembers extends Members = {
    [Key in keyof Source]: Source[Key];
  }
> = Constructor<ConstructorParameters<Source>, InstanceType<Source>> &
  LastMembers &
  Record<
    NextKey,
    <
      NewMembers extends Members,
      NextMembers extends Members = {
        [Key in Exclude<keyof LastMembers, keyof NewMembers>]: LastMembers[Key];
      } &
        NewMembers
    >(
      newMembers: NewMembers & ThisType<NextMembers>,
    ) => Chainable<Source, NextKey, NextMembers>
  >;

/**
 * Extends from a constructor and casts the new class as an instance of `Chainable`.
 *
 * @param source - The constructor to extend and coerce into a chainable.
 * @param key - The name of the method for moving down the chain.
 */
export const Chainable = <
  Source extends AnyConstructor,
  NextKey extends string = "next"
>(
  source: Source,
  key?: NextKey,
): Chainable<Source, NextKey> => {
  return Object.assign(class extends source {}, {
    [key || "next"](newMembers: Members) {
      return Object.assign(class extends (this as any) {}, newMembers);
    },
  }) as any;
};
