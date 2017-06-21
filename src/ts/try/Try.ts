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
