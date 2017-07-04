import {sequenceM} from '../monad/Monad';
import {compose} from '../function/function';

/**
 * A type describing a value that may be empty.
 * Use type narrowing or OptionDecorator to extract values.
 */
export interface Option<A> {
  flatMap<B>(f: (a:A) => Option<B>): Option<B>
  then<B>(f: (a:A) => Option<B>): Option<B>
  map<B>(f: (a: A) => B): Option<B>
  caseOf<Z>(c: CaseOfMatcher<A, Z>): Z
  getOrElse(f: () => A): A
  orElse(z: A): A
  isDefined(): Boolean
  filter(p: (a: A) => Boolean): Option<A>
}

export namespace Option {
  export function of<A>(a?:A): Option<A> {
    return a == null ? None() : Some(a);
  }
}

export class SomeImpl<A> implements Option<A> {
  private value: A;

  constructor(a: A){
    this.value = a;
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return f(this.value);
  }
  then<B>(f: (a: A) => Option<B>): Option<B> {
    return this.flatMap(f);
  }
  map<B>(f: (a: A) => B): Option<B> {
    return Some(f(this.value));
  }
  caseOf<Z>(c: CaseOfMatcher<never, Z>): Z {
    return c.none();
  }
  getOrElse(f: () => A): A  {
    return this.value;
  }
  orElse(z: A): A {
    return this.value;
  }
  isDefined(): Boolean {
    return true;
  }
  filter(p: (a: A) => Boolean): Option<A> {
    return p(this.value) ? this : None();
  }
}

export class NoneImpl implements Option<never> {
  flatMap<B>(f: (a: never) => Option<B>): Option<B> {
    return this;
  }
  then<B>(f: (a: never) => Option<B>): Option<B> {
    return this.flatMap(f);
  }
  map<B>(f: (a: never) => B): Option<B> {
    return this;
  }
  caseOf<Z>(c: CaseOfMatcher<never, Z>): Z {
    return c.none();
  }
  getOrElse(f: () => never): never  { // wut
    return f();
  }
  orElse(z: never): never {
    return z;
  }
  isDefined(): Boolean {
    return false;
  }
  filter(p: (a: never) => Boolean): Option<never> {
    return this;
  }
}

export function Some<A>(a: A): SomeImpl<A> {
  return new SomeImpl(a);
}

export function None(): NoneImpl {
  return new NoneImpl();
}

export type CaseOfMatcher<A, B> = {
  some: (a: A) => B,
  none: () => B
};

interface CaseOfFunc<A> {
  <B>(matcher: CaseOfMatcher<A, B>): B;
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
  return sequenceM<T, Option<T[]>>(values, Some);
}
