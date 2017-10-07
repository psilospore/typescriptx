import {sequenceM} from '../monad/Monad';
import {compose, identity} from '../function/function';

/**
 * A type describing a value that may be empty.
 */
export class Option<A> {
  a?: A;
  constructor(a?: A) {
    if(a){
      this.a = a;
    } else {
      this.a = null;
    }
  }
  caseOf<Z>(c: CaseOfMatcher<A, Z>): Z {
    if(this.a === null) {
      return c.some(this.a)
    } else {
      return c.none();
    }
  }
  flatMap<B>(f: (a:A) => Option<B>): Option<B> {
    return this.caseOf({
      some: a => f(a),
      none: () => Option.empty<B>()
    });
  }
  then<B>(f: (a:A) => Option<B>): Option<B> {
    return this.caseOf({
      some: a => f(a),
      none: () => Option.empty<B>()
    });
  }
  map<B>(f: (a: A) => B): Option<B> {
    return this.caseOf({
      some: a => Option.of(f(a)),
      none: () => Option.empty<B>()
    });
  }
  getOrElse(f: () => A): A {
    return this.caseOf({
      some: identity,
      none: () => f()
    });
  }
  orElse(z: A): A {
    return this.caseOf({
      some: identity,
      none: () => z
    });
  }
  isDefined(): Boolean {
    return this.a !== null;
  }
  filter(p: (a: A) => Boolean): Option<A> {
    return this.caseOf({
      some: a => p(a) ? this : Option.empty(),
      none: () => this
    });
  }
}

export namespace Option {
  export function of<A>(a?:A): Option<A> {
    return new Option(a);
  }
  export function apply<A>(a?:A): Option<A> {
    return Option.of(a);
  }
  export function empty<A>(a?:A): Option<A> {
    return new Option(null);
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
    return sequenceM<T, any>(values as any, Option.of as any); //oohf
  }
}

export type CaseOfMatcher<A, B> = {
  some: (a: A) => B,
  none: () => B
};

interface CaseOfFunc<A> {
  <B>(matcher: CaseOfMatcher<A, B>): B;
}
