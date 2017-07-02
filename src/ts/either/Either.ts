import { identity } from '../function/function';

/**
 * A Type describing a value that can either be `Left` with a value of type `L`,
 * or `Right` with a value of `R`.
 * Use type narrowing or `EitherDecorator` to extract values.
 */
export type Either<L, R> = Left<L> | Right<R>;

/**
 * A `Left` container with value of type `L`
 */
export interface Left<L> {
  type: 'Left';
  left: L;
}

/**
 * A `Right` container with value of type `R`
 */
export interface Right<R> {
  type: 'Right';
  right: R;
}

/**
 * An object that handles values of type `L` or `R`, evaluating them to `Z`
 */
export type CaseMatcher<L, R, Z> = {
  left:  (l: L) => Z,
  right: (r: R) => Z
};

/**
 * Adds functional combinators to the Either type.
 */
export class EitherDecorator<L, R> {
  private e: Either<L, R>;

  constructor(e: Either<L, R>) {
    this.e = e;
  }
  /**
   * Unwraps this value, returning the underlying decorated Either.
   * Use this when you need to supply a plain object.
   */
  un(): Either<L, R> {
    return this.e;
  }
  /**
   * Returns the result of right if the decorated Either is Right,
   * and left if the decorated Either is Right.
   */
  caseOf<Z>(m: CaseMatcher<L, R, Z>): Z {
    switch(this.e.type) {
      case 'Left':
        return m.left(this.e.left);
      case 'Right':
        return m.right(this.e.right);
    }
  }
  /**
   * Returns the result of f if the decorated Either is Right.
   * If the decorated Either is Left, that Left value will be returned.
   */
  flatMap<RR>(f: (r: R) => Either<L, RR>): EitherDecorator<L, RR> {
    return this.caseOf({
      left: l => E<L, RR>(Left(l)),
      right: r => E<L, RR>(f(r))
    });
  }
  /**
   * Returns the result of f wrapped in a Right if the decorated Either is Right.
   * If the decorated Either is Left, that Left value will be returned.
   */
  map<RR>(f: (r: R) => RR): EitherDecorator<L, RR> {
    return this.caseOf({
      left: l => E<L, RR>(Left(l)),
      right: r => E<L, RR>(Right(f(r)))
    });
  }
  /**
   * Returns true if the decorated Either is Right, false otherwise.
   */
  isRight(): Boolean {
    return this.caseOf({
      left:  l => false,
      right: r => true
    });
  }
  /**
   * Returns true if the decorated Either is Left, false otherwise.
   * The inverse of isRight()
   */
  isLeft(): Boolean {
    return !this.isRight();
  }

  /**
   * Swaps the value inside this EitherDecorator. 
   */
  swap(): EitherDecorator<R, L> {
    return this.caseOf({
      left: l => E<R, L>(Right(l)),
      right: r => E<R, L>(Left(r))
    });
  }
  /**
   * Returns the right value if this EitherDecorator is right, the result of f if it is left.
   * f will not be invoked unless this value is left.
   * @param f
   */
  getOrElse(f: () => R): R {
    return this.caseOf({
      left:  l => f(),
      right: identity
    });
  }
  /**
   * Return R if this EitherDecorator is right, and z if it is left
   * @param z the value to return in case of left
   */
  orElse(z: R): R {
    return this.caseOf({
      left: l => z,
      right: identity
    });
  }
  /**
   * Returns a list of size one with r if right, or size zero if left
   */
  toList(): R[]{
    return this.caseOf({
      left: () => [],
      right: r => [r]
    });
  }
}

/**
 * Wraps an Either in an EitherDecorator, which provides
 * some useful functional combinators.
 */
export function E<L, R>(e: Either<L, R>): EitherDecorator<L, R> {
  return new EitherDecorator(e);
}

/**
 * Creates an instance of Left
 */
export function Left<L>(l: L): Left<L> {
  return {
    type: 'Left',
    left: l
  };
};

/**
 * Creates an instance of Right.
 */
export function Right<R>(r: R): Right<R> {
  return {
    type: 'Right',
    right: r
  };
}

// grr why can't i write this generically... Do I really need Higher Kinded Types?
function sequence<A, B>(eithers: Either<A, B>[]): Either<A, B[]> {
  return eithers.reduce((prevValue, currValue) => {
    return E(prevValue).flatMap(values => {
      return E(currValue).map(value => ([...values, value])).un()
    }).un();
  }, <Either<A, B[]>> Right(<B[]>[]));
}

export function all<A, B1, B2, B3, B4, B5, B6, B7, B8, B9>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>, Either<A, B5>, Either<A, B6>, Either<A, B7>, Either<A, B8>, Either<A, B9>]): Either<A, [B1, B2, B3, B4, B5, B6, B7, B8, B9]>;
export function all<A, B1, B2, B3, B4, B5, B6, B7, B8>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>, Either<A, B5>, Either<A, B6>, Either<A, B7>, Either<A, B8>]): Either<A, [B1, B2, B3, B4, B5, B6, B7, B8]>;
export function all<A, B1, B2, B3, B4, B5, B6, B7>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>, Either<A, B5>, Either<A, B6>, Either<A, B7>]): Either<A, [B1, B2, B3, B4, B5, B6, B7]>;
export function all<A, B1, B2, B3, B4, B5, B6>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>, Either<A, B5>, Either<A, B6>]): Either<A, [B1, B2, B3, B4, B5, B6]>;
export function all<A, B1, B2, B3, B4, B5>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>, Either<A, B5>]): Either<A, [B1, B2, B3, B4, B5]>;
export function all<A, B1, B2, B3, B4>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>]): Either<A, [B1, B2, B3, B4]>;
export function all<A, B1, B2, B3>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>]): Either<A, [B1, B2, B3]>;
export function all<A, B1, B2>(values: [Either<A, B1>, Either<A, B2>]): Either<A, [B1, B2]>;
export function all<A, B>(values: (Either<A, B>)[]): Either<A, B[]> {
  return sequence(values);
}