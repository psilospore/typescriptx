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
  isRight<L, R>(): Boolean {
    return this.caseOf({
      left:  l => false,
      right: r => true
    });
  }
  /**
   * Returns true if the decorated Either is Left, false otherwise.
   * The inverse of isRight()
   */
  isLeft<L, R>(): Boolean {
    return !this.isRight();
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
