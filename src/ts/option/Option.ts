import {sequenceM} from '../monad/Monad';
import {compose} from '../function/function';

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

export function Option<A>(value?: A): Option<A> {
  switch(value){
    case null:
    case undefined:
      return None();
    default:
      return Some(value);
  }
}

export namespace Option {

  type OptionHandler<A, B> = (a: Option<A>) => B;

  type Lifted<A, B> = OptionHandler<A, Option<B>>;

  export function caseOf<A, B>(c: CaseOfMatcher<A, B>): OptionHandler<A, B> {
    return o => {
      if(o.type === "Some"){
        return c.some(o.value);
      } else {
        return c.none();
      }
    }
  }
  export function map<A, B>(f: (a:A) => B): Lifted<A, B> {
    return Option.caseOf<A, Option<B>>({
        some: a => Some(f(a)),
        none: () => None()
      });
  }

  export function flatMap<A, B>(f: (a:A) => Option<B>): Lifted<A, B> {
    return Option.caseOf<A, Option<B>>({
        some: a => f(a),
        none: () => None()
      });
  }

  export function orElse<A, B>(f: () => Option<B>): Lifted<A, A | B> {
    return Option.caseOf<A, Option<A | B>>({
        some: a => Some(a),
        none: () => f()
      });
  }

  export function getOrElse<A, B>(f: () => B): OptionHandler<A, A | B> {
    return Option.caseOf<A, A | B>({
        some: a => a,
        none: () => f()
      });
  }

  export function filter<A>(predicate: (a: A) => Boolean): Lifted<A, A> {
    return Option.caseOf<A, Option<A>>({
        some: a => predicate(a) ? Some(a) : None(),
        none: () => None()
      });
  }

  export const isDefined: OptionHandler<any, Boolean> = op => op.type === "Some";

  const fmap = Option.flatMap;

  export function op<A1, A2, A3, A4>(a: Option<A1>, f: (a:A1) => Option<A2>, g: (a: A2) => Option<A3>, h: (a: A3) => Option<A4>): Option<A3>
  export function op<A, B, C>(a: Option<A>, f: (a:A) => Option<B>, g: (b: B) => Option<C>): Option<C>
  export function op<A, B>(a: Option<A>, f: (a:A) => Option<B>): Option<B>;
  export function op(a, ...fs) {
    return fs.reduce((agg, f) =>
      compose(
        fmap(f),
        fmap(agg)
      )
    , Some);
  }

  export function all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>, Option<T5>, Option<T6>, Option<T7>, Option<T8>, Option<T9>]): Option<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
  export function all<T1, T2, T3, T4, T5, T6, T7, T8>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>, Option<T5>, Option<T6>, Option<T7>, Option<T8>]): Option<[T1, T2, T3, T4, T5, T6, T7, T8]>;
  export function all<T1, T2, T3, T4, T5, T6, T7>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>, Option<T5>, Option<T6>, Option<T7>]): Option<[T1, T2, T3, T4, T5, T6, T7]>;
  export function all<T1, T2, T3, T4, T5, T6>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>, Option<T5>, Option<T6>]): Option<[T1, T2, T3, T4, T5, T6]>;
  export function all<T1, T2, T3, T4, T5>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>, Option<T5>]): Option<[T1, T2, T3, T4, T5]>;
  export function all<T1, T2, T3, T4>(values: [Option<T1>, Option<T2>, Option<T3>, Option<T4>]): Option<[T1, T2, T3, T4]>;
  export function all<T1, T2, T3>(values: [Option<T1>, Option<T2>, Option<T3>]): Option<[T1, T2, T3]>;
  export function all<T1, T2>(values: [Option<T1>, Option<T2>]): Option<[T1, T2]>;
  export function all<T>(values: (Option<T>)[]): Option<T[]>;
  export function all(values: Option<any>[]) {
    return values.reduce((aggOp: Option<any[]>, aOp: Option<any>) =>
      fmap((agg: any[]) => {
        return map(a => agg.concat([a]))(aOp)
      })(aggOp)
    , Some([]));
  }
}

// const oStr: Option<string> = Some("sdf");
// const oNum: Option<number> = Some(4);

// var oFmap = compose(
//   fmap((num: number) => Some(num + num)),
//   fmap((str: string) => Some(str.length))
// );

// var oMap = compose(
//   map((num: number) => num + num),
//   map((str: string) => str.length)
// );