
export interface Monad<A> {
    flatMap<B, C extends Monad<B>>(f: (a: A) => C): C
}

export interface MonadPoint {
  <A, B extends Monad<A>>(a: A): B
}

export function sequenceM<A, B extends Monad<A[]>>(options: Monad<A>[], point: MonadPoint): B {
  return options.reduce((prevValue, currValue) => {
    return prevValue.flatMap(values => {
      return currValue.flatMap<A[], B>(value => <B> point([...values, value]))
    })
  }, <B> point(<A[]>[]));
}