/**
 * A type describing a value that may be empty.
 * Use type narrowing or MaybeDecorator to extract values.
 */
export type Maybe<A> = Just<A> | Nothing;

/**
 * A representaion
 */
export interface Just<A> {
  readonly type: 'Just';
  readonly value: A;
};

export interface Nothing {
  readonly type: 'Nothing'
};

export type CaseOfMatcher<A, B> = {
  just: (a: A) => B,
  nothing: () => B
};

interface CaseOfFunc<A> {
  <B>(matcher: CaseOfMatcher<A, B>): B;
}

export class MaybeDecorator<A> {
  private m: Maybe<A>;

  constructor(m: Maybe<A>) {
    this.m = m;
  }
  un(): Maybe<A> {
    return this.m;
  }
  caseOf<Z>(c: CaseOfMatcher<A, Z>): Z {
    switch(this.m.type) {
      case 'Just':
        return c.just(this.m.value);
      case 'Nothing':
        return c.nothing();
    }
  }
  map<B>(f: (a: A) => B): MaybeDecorator<B> {
    return this.caseOf({
      just:     a => M(Just(f(a))),
      nothing: () => M<B>(Nothing())
    });
  }
  flatMap<B>(f: (a: A) => Maybe<B>): MaybeDecorator<B> {
    return this.caseOf({
      just:     a => M(f(a)),
      nothing: () => M<B>(Nothing())
    });
  }
  getOrElse(f: () => A): A {
    return this.caseOf({
      just:     a => a,
      nothing: () => f()
    });
  }
  orElse(z: A): A {
    return this.caseOf({
      just: a => a,
      nothing: () => z
    });
  }
  isJust(): Boolean {
    return this.caseOf({
      just: a => true,
      nothing: () => false
    });
  }
  filter(predicate: (a: A) => Boolean): MaybeDecorator<A> {
    return this.flatMap(a => predicate(a) ? Just(a) : Nothing());
  }
}

export const M = function<A>(m: Maybe<A>): MaybeDecorator<A> {
  return new MaybeDecorator(m);
};

export function Maybe<A>(value?: A): Maybe<A> {
  switch(value){
    case null:
    case undefined:
      return Nothing();
    default:
      return Just(value);
  }
}

export function Just<A>(value: A): Just<A> {
  return {
    type: 'Just',
    value
  }
};

export function Nothing(): Nothing {
  return {
    type: 'Nothing'
  }
};
