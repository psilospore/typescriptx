export type Try<A> = Success<A> | Err;

export interface Success<A> {
  type: 'Success';
  value: A;
};

export interface Err {
  type: 'Err';
  error: any;
};

export type TryCaseMatcher<A, Z> = {
  success:  (value: A) => Z,
  err: (error: any) => Z
};

export class TryDecorator<A> {
  value: Try<A>

  constructor(a: Try<A>) {
    this.value = a;
  }
  un(): Try<A> {
    return this.value;
  }
  caseOf<Z>(c: TryCaseMatcher<A, Z>): Z {
    switch(this.value.type) {
      case 'Success':
        return c.success(this.value.value);
      case 'Err':
        return c.err(this.value.error);
    }
  }
  map<B>(f: (a:A) => B): TryDecorator<B> {
    return this.caseOf({
      success: a => T(Success(f(a))),
      err: err => T<B>(Err(err))
    });
  }
  flatMap<B>(f: (a:A) => Try<B>): TryDecorator<B> {
    return this.caseOf({
      success: a => T(f(a)),
      err: err => T<B>(Err(err))
    });
  }
}

export function T<A>(t: Try<A>): TryDecorator<A> {
  return new TryDecorator(t);
}

export function Try<A>(f: () => A): Try<A> {
  try {
    return Success(f());
  } catch(e) {
    return Err(e);
  }
}

export function Success<A>(a: A): Success<A> {
  return {
    type: 'Success',
    value: a
  };
}

export function Err(error: any): Err {
  return {
    type: 'Err',
    error
  }
}

function sequence<A>(trys: Try<A>[]): Try<A[]> {
  return trys.reduce((prevValue, currValue) => (
    T(prevValue).flatMap(values =>
      T(currValue).map(value => ([...values, value])).un()
    ).un()
  ), <Try<A[]>> Success(<A[]>[]));
}

export function all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [Try<T1>, Try<T2>, Try<T3>, Try<T4>, Try<T5>, Try<T6>, Try<T7>, Try<T8>, Try<T9>]): Try<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
export function all<T1, T2, T3, T4, T5, T6, T7, T8>(values: [Try<T1>, Try<T2>, Try<T3>, Try<T4>, Try<T5>, Try<T6>, Try<T7>, Try<T8>]): Try<[T1, T2, T3, T4, T5, T6, T7, T8]>;
export function all<T1, T2, T3, T4, T5, T6, T7>(values: [Try<T1>, Try<T2>, Try<T3>, Try<T4>, Try<T5>, Try<T6>, Try<T7>]): Try<[T1, T2, T3, T4, T5, T6, T7]>;
export function all<T1, T2, T3, T4, T5, T6>(values: [Try<T1>, Try<T2>, Try<T3>, Try<T4>, Try<T5>, Try<T6>]): Try<[T1, T2, T3, T4, T5, T6]>;
export function all<T1, T2, T3, T4, T5>(values: [Try<T1>, Try<T2>, Try<T3>, Try<T4>, Try<T5>]): Try<[T1, T2, T3, T4, T5]>;
export function all<T1, T2, T3, T4>(values: [Try<T1>, Try<T2>, Try<T3>, Try<T4>]): Try<[T1, T2, T3, T4]>;
export function all<T1, T2, T3>(values: [Try<T1>, Try<T2>, Try<T3>]): Try<[T1, T2, T3]>;
export function all<T1, T2>(values: [Try<T1>, Try<T2>]): Try<[T1, T2]>;
export function all<T>(values: (Try<T>)[]): Try<T[]> {
  return sequence(values);
}
