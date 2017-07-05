import { identity } from '../function/function';
import { sequenceM } from '../monad/Monad';

/**
 * A Type describing a value that can either be `Left` with a value of type `L`,
 * or `Right` with a value of `R`.
 * Use type narrowing or `EitherDecorator` to extract values.
 */
export interface Either<L, R> {
  /**
   * Returns the result of right if this Either is Right,
   * and left if this Either is Right.
   * @param m an object containing functions to apply to the value inside of this either.
   */
  caseOf<Z>(matcher: CaseMatcher<L, R, Z>): Z;
  /**
   * Applies f to the value inside this Eitehr if this Either is Right.
   * If the decorated Either is Left, that Left value will be returned.
   * @param f the function to apply to the right value of this either.
   */
  flatMap<RR>(f: (r: R) => Either<L, RR>): Either<L, RR>;
  /**
   * Applies f to the value inside of this Either, if the value is right, 
   * otherwise, does nothing.
   * @param f the function to apply to the right value of this either
   */
  map<RR>(f: (r: R) => RR): Either<L, RR>;
  /**
   * Returns true if the decorated Either is Right, false otherwise.
   */
  isRight(): Boolean;
  /**
   * Returns true if the decorated Either is Left, false otherwise.
   * The inverse of isRight()
   */
  isLeft(): Boolean;
  /**
   * Swaps the value inside this Either.
   */
  swap(): Either<R, L>
  /**
   * Returns the right value if this EitherDecorator is right, the result of f if it is left.
   * f will not be invoked unless this value is left.
   * @param f a function to supply the value if this either is left.
   */
  getOrElse(f: () => R): R
  /**
   * Return R if this EitherDecorator is right, and z if it is left
   * @param z the value to return in case of left
   */
  orElse(z: R): R;
  /**
   * Returns a list of size one with r if right, or size zero if left
   */
  toList(): R[];
}

/**
 * A `Left` container with value of type `L`.
 */
export class Left<L, R> implements Either<L, R> {
  left: L;
  constructor(l: L){
    this.left = l;
  }
  /**
   * Returns the result of left applied to this value.
   * @param m an object containing functions to apply to the value inside of this either.
   */
  caseOf<Z>(matcher: CaseMatcher<L, R, Z>): Z {
    return matcher.left(this.left);
  }
  /**
   * Returns itself without applying f.
   * @param f the function to apply to the right value of this either.
   */
  flatMap<RR>(f: (r: R) => Either<L, RR>): Either<L, RR> {
    return Either.left<L, RR>(this.left);
  }
  /**
   * Does nothing, since this value is left.
   * @param f the function to apply to the right value of this either.
   */
  map<RR>(f: (r: R) => RR): Either<L, RR> {
    return Either.left<L, RR>(this.left);
  }
  /**
   * Returns false.
   */
  isRight(): Boolean {
    return false;
  }
  /**
   * Returns true.
   */
  isLeft(): Boolean {
    return true;
  }
  /**
   * Swaps the value inside this Either.
   */
  swap(): Either<R, L> {
    return Either.right<R, L>(this.left);
  }
  /**
   * Returns the result of f().
   * @param f a function to supply the value if this either is left.
   */
  getOrElse(f: () => R): R {
    return f();
  }
  /**
   * Returns z.
   * @param z the value to return in case of left.
   */
  orElse(z: R): R {
    return z;
  }
  /**
   * Returns an empty list.
   */
  toList(): R[] {
    return [];
  }
}

/**
 * A `Right` container with value of type `R`.
 */
export class Right<L, R> implements Either<L, R> {
  right: R;
  constructor(r: R){
    this.right = r;
  }
  /**
   * Returns the result of right applied to this value.
   * @param m an object containing functions to apply to the value inside of this either.
   */
  caseOf<Z>(matcher: CaseMatcher<L, R, Z>): Z {
    return matcher.right(this.right);
  }
  /**
   * Applies f to the value inside this Right, returning the result.
   * @param f the function to apply to the right value of this either.
   */
  flatMap<RR>(f: (r: R) => Either<L, RR>): Either<L, RR> {
    return f(this.right);
  }
  /**
   * Applies f to the value inside this Right.
   * @param f the function to apply to the right value of this either.
   */
  map<RR>(f: (r: R) => RR): Either<L, RR> {
    return Either.right<L, RR>(f(this.right));
  }
  /**
   * Returns true.
   */
  isRight(): Boolean {
    return true;
  }
  /**
   * Returns false.
   */
  isLeft(): Boolean {
    return false;
  }
  /**
   * Swaps the value inside this Either.
   */
  swap(): Either<R, L> {
    return Either.left<R, L>(this.right);
  }
  /**
   * Returns the value inside this Right.
   * @param f a function to supply the value if this either is left.
   */
  getOrElse(f: () => R): R {
    return this.right;
  }
  /**
   * Returns the value inside this Right.
   * @param z the value to return in case of left.
   */
  orElse(z: R): R {
    return this.right;
  }
  /**
   * Returns a list with the right value inside.
   */
  toList(): R[] {
    return [this.right];
  }
}

/**
 * An object that handles values of type `L` or `R`, evaluating them to `Z`.
 */
export type CaseMatcher<L, R, Z> = {
  left:  (l: L) => Z,
  right: (r: R) => Z
};

export namespace Either {

  /**
   * Builds a new instance of Left.
   * @param left the value to store in the Left.
   */
  export function left<L, R>(left: L): Either<L, R> {
    return new Left<L, R>(left);
  }

  export function leftB<L>(left: L): LeftBuilder<L> {
    return {
      build<R>(){
        return new Left<L, R>(left);
      }
    };
  }
  /**
   * Builds a new instance of Right.
   * @param right the value to store in the Right.
   */
  export function right<L, R>(right: R): Either<L, R> {
    return new Right<L, R>(right);
  }

  /**
   * Combines an array of Eithers into a single Either of tuple, if every Either value supplied is Right.
   * @param values the eithers to combine.
   */
  export function all<A, B1, B2, B3, B4, B5, B6, B7, B8, B9>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>, Either<A, B5>, Either<A, B6>, Either<A, B7>, Either<A, B8>, Either<A, B9>]): Either<A, [B1, B2, B3, B4, B5, B6, B7, B8, B9]>;
  /**
   * Combines an array of Eithers into a single Either of tuple, if every Either value supplied is Right.
   * @param values the eithers to combine.
   */
  export function all<A, B1, B2, B3, B4, B5, B6, B7, B8>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>, Either<A, B5>, Either<A, B6>, Either<A, B7>, Either<A, B8>]): Either<A, [B1, B2, B3, B4, B5, B6, B7, B8]>;
  /**
   * Combines an array of Eithers into a single Either of tuple, if every Either value supplied is Right.
   * @param values the eithers to combine.
   */
  export function all<A, B1, B2, B3, B4, B5, B6, B7>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>, Either<A, B5>, Either<A, B6>, Either<A, B7>]): Either<A, [B1, B2, B3, B4, B5, B6, B7]>;
  /**
   * Combines an array of Eithers into a single Either of tuple, if every Either value supplied is Right.
   * @param values the eithers to combine.
   */
  export function all<A, B1, B2, B3, B4, B5, B6>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>, Either<A, B5>, Either<A, B6>]): Either<A, [B1, B2, B3, B4, B5, B6]>;
  /**
   * Combines an array of Eithers into a single Either of tuple, if every Either value supplied is Right.
   * @param values the eithers to combine.
   */
  export function all<A, B1, B2, B3, B4, B5>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>, Either<A, B5>]): Either<A, [B1, B2, B3, B4, B5]>;
  /**
   * Combines an array of Eithers into a single Either of tuple, if every Either value supplied is Right.
   * @param values the eithers to combine.
   */
  export function all<A, B1, B2, B3, B4>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>, Either<A, B4>]): Either<A, [B1, B2, B3, B4]>;
  /**
   * Combines an array of Eithers into a single Either of tuple, if every Either value supplied is Right.
   * @param values the eithers to combine.
   */
  export function all<A, B1, B2, B3>(values: [Either<A, B1>, Either<A, B2>, Either<A, B3>]): Either<A, [B1, B2, B3]>;
  /**
   * Combines an array of Eithers into a single Either of tuple, if every Either value supplied is Right.
   * @param values the eithers to combine.
   */
  export function all<A, B1, B2>(values: [Either<A, B1>, Either<A, B2>]): Either<A, [B1, B2]>;
  /**
   * Combines an array of Eithers into a single Either of tuple, if every Either value supplied is Right.
   * @param values the eithers to combine.
   */
  export function all<A, B>(values: (Either<A, B>)[]): Either<A, B[]> {
    return sequenceM<B, Either<A, B[]>>(values, Either.right);
  }

  export type LeftBuilder<L> = {
    build<R>(): Either<L, R>
  }

  export type RightBuilder<R> = {
    build<L>(): Either<L, R>
  }

}