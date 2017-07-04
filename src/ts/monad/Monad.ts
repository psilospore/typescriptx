
export interface Monad<A> {
    flatMap<B, C extends Monad<B>>(f: (a: A) => C): C
}

export interface MonadPoint {
  <A, B extends Monad<A>>(a: A): B
}

export interface MonadBuilder {
  <A, B extends Monad<A>>(a: A): B
}

export function sequenceM<A, B extends Monad<A[]>>(options: Monad<A>[], point: MonadPoint): B {
  return options.reduce((prevValue, currValue) => {
    return prevValue.flatMap(values => {
      return currValue.flatMap<A[], B>(value => <B> point([...values, value]))
    })
  }, <B> point(<A[]>[]));
}

/**
 * 
 * @param m a monad builder
 * @param f 
 */
export function Do<A, B extends Monad<A>>(f: () => Iterator<B>): B {
  const gen = f();
  
  function doRec(v = undefined) {
    const {value, done} = gen.next(v);
    return done ? value : value.flatMap(doRec);
  }

  return doRec();
}
