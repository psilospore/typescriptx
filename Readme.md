# Monads

Monads for JavaScript/Typescript.

## Principles

### 1. Simple ADT
*Monads* uses simple [Algebraic Data Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions) to encode its entities which allows us to express values with plain JavaScript objects. This makes it an excellent choice for serializing type-safe entities with a tool like lscache or redux.
### 2. Developer Experience
*Monads* tries not to clutter your code, and will prefer concise decorators in an attempt to not distract readers and writers from the point of the code.

## Maybe

    type Maybe<A> = Just<A> | Nothing

A `Maybe` represents a value that can be present or null. Useful as a return type for a function that may return null.

## Either

    type Either<L, R> = Left<L> | Right<R>

An `Either` represents a value that can be one type or another. Useful as a return type for functions that can have multiple return types.

## Try

    export type Try<A> = Success<A> | Err

A `Try` represents the result of block of code that may encounter an error. Useful to encapsulate the value whose computation may throw an error.
