[Node Package Template Reference](../README.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Type aliases

* [Chainable](_index_.md#chainable)

### Functions

* [Chainable](_index_.md#const-chainable)

## Type aliases

###  Chainable

Ƭ **Chainable**: *Constructor‹ConstructorParameters‹Source›, InstanceType‹Source›› & LastMembers & Record‹NextKey, function›*

Defined in index.ts:15

A representation of a constructor and its recursively-defined parent relationships
and its `next` method (potentially supplied a different key).

## Functions

### `Const` Chainable

▸ **Chainable**‹**Source**, **NextKey**›(`source`: Source, `key?`: NextKey): *Chainable‹Source, NextKey›*

Defined in index.ts:42

Extends from a constructor and casts the new class as an instance of `Chainable`.

**Type parameters:**

▪ **Source**: *AnyConstructor*

▪ **NextKey**: *string*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`source` | Source | The constructor to extend and coerce into a chainable. |
`key?` | NextKey | The name of the method for moving down the chain.  |

**Returns:** *Chainable‹Source, NextKey›*
