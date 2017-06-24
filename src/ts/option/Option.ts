/**
 * A type describing a value that may be empty.
 * Use type narrowing or OptionDecorator to extract values.
 */
export type Option<A> = Some<A> | None;

export interface Some<A> {
  type: 'Some',
  value: A
};

export function Some<A>(a: A): Some<A> {
  return {
    type: 'Some',
    value: a
  }
}

export interface None {
  type: 'None'
};

export function None(): None {
  return {
    type: 'None'
  };
}

export type CaseOfMatcher<A, B> = {
  some: (a: A) => B,
  none: () => B
};

interface CaseOfFunc<A> {
  <B>(matcher: CaseOfMatcher<A, B>): B;
}

export class OptionDecorator<A> {
  private m: Option<A>;

  constructor(m: Option<A>) {
    this.m = m;
  }
  un(): Option<A> {
    return this.m;
  }
  caseOf<Z>(c: CaseOfMatcher<A, Z>): Z {
    switch(this.m.type){
      case 'Some':
        return c.some(this.m.value);
      default:
        return c.none();
    }
  }
  map<B>(f: (a: A) => B): OptionDecorator<B> {
    return this.caseOf({
      some:  a => M<B>(Some(f(a))),
      none: () => M<B>(None())
    });
  }
  flatMap<B>(f: (a: A) => Option<B>): OptionDecorator<B> {
    return this.caseOf({
      some:     a => M(f(a)),
      none: () => M<B>(None())
    });
  }
  getOrElse(f: () => A): A {
    return this.caseOf({
      some:     a => a,
      none: () => f()
    });
  }
  orElse(z: A): A {
    return this.caseOf({
      some: a => a,
      none: () => z
    });
  }
  isDefined(): Boolean {
    return this.caseOf({
      some: a => true,
      none: () => false
    });
  }
  filter(predicate: (a: A) => Boolean): OptionDecorator<A> {
    return this.flatMap(a => predicate(a) ? Some(a) : None());
  }
}

export const M = function<A>(m: Option<A>): OptionDecorator<A> {
  return new OptionDecorator(m);
};

export function Option<A>(value?: A): Option<A> {
  switch(value){
    case null:
    case undefined:
      return None();
    default:
      return Some(value);
  }
}

function sequence<A>(options: Option<A>[]): Option<A[]> {
  return options.reduce((prevValue, currValue) => {
    return M(prevValue).flatMap(values => {
      return M(currValue).map(value => ([...values, value])).un()
    }).un();
  }, <Option<A[]>> Some(<A[]>[]));
}

export type Monad<A> = {
  flatMap<B>(a: (A) => Monad<B>): Monad<B>
  map<B>(a: (A) => B): Monad<B> //map is not required for a monad
};

export function sequenceM<A, B extends Monad<A>, Z>(monads: B[], point: (Z) => Monad<Z>): Monad<A[]>{
  return monads.reduce((prevValue, currValue) => {
    return prevValue.flatMap(values => {
      return currValue.map(value => ([...values, value]))
    });
  }, point([]));
}

export function all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>, Option<T5>, Option<T6>, Option<T7>, Option<T8>, Option<T9>]): Option<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
export function all<T1, T2, T3, T4, T5, T6, T7, T8>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>, Option<T5>, Option<T6>, Option<T7>, Option<T8>]): Option<[T1, T2, T3, T4, T5, T6, T7, T8]>;
export function all<T1, T2, T3, T4, T5, T6, T7>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>, Option<T5>, Option<T6>, Option<T7>]): Option<[T1, T2, T3, T4, T5, T6, T7]>;
export function all<T1, T2, T3, T4, T5, T6>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>, Option<T5>, Option<T6>]): Option<[T1, T2, T3, T4, T5, T6]>;
export function all<T1, T2, T3, T4, T5>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>, Option<T5>]): Option<[T1, T2, T3, T4, T5]>;
export function all<T1, T2, T3, T4>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>]): Option<[T1, T2, T3, T4]>;
export function all<T1, T2, T3>(values: [Option<T1>, Option<T2>, Option<T3>]): Option<[T1, T2, T3]>;
export function all<T1, T2>(values: [Option<T1>, Option<T2>]): Option<[T1, T2]>;
export function all<T>(values: (Option<T>)[]): Option<T[]> {
  return (<any>sequence)(values);
}