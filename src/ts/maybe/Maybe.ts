export type Maybe<A> = Just<A> | Nothing;

export interface Just<A> {
  readonly type: 'Just';
  readonly value: A;
};

export interface Nothing {
  readonly type: 'Nothing'
};

type CaseOfMatcher<A, B> = {
  just: (a: A) => B,
  nothing: () => B
};

interface CaseOfFunc<A> {
  <B>(matcher: CaseOfMatcher<A, B>): B;
}

class MaybeDecorator<A> {
  private m: Maybe<A>;

  constructor(m: Maybe<A>) {
    this.m = m;
  }
  unwrap(): Maybe<A> {
    return this.m;
  }
  map<B>(f: (a: A) => B): MaybeDecorator<B> {
    switch(this.m.type) {
      case 'Just':
        return new MaybeDecorator(Just(f(this.m.value)));
      case 'Nothing':
        return new MaybeDecorator<B>(Nothing());
    }
  }
}

export const M = function<A>(m: Maybe<A>): MaybeDecorator<A> {
  return new MaybeDecorator(m);
};

export const Maybe = {
  of<A>(a: A): Maybe<A> {
    switch(a) {
      case null:
      case undefined:
        return Nothing();
      default:
        return Just(a);
    }
  },
  caseOf<A>(m: Maybe<A>): CaseOfFunc<A> {
    switch(m.type){
      case 'Just':
        return c => c.just(m.value)
      case 'Nothing':
        return c => c.nothing()
    }
  },
  fold<A, B>(m: Maybe<A>): (z: () => B) => (f: (a: A) => B) => B {
    return Maybe.caseOf(m)({
      just:     a => z => f => f(a),
      nothing: () => z => f => z()
    });
  },
  map<A, B>(m: Maybe<A>): (f: (a: A) => B) => Maybe<B>{
    switch(m.type){
      case 'Just':
        return f => Just<B>(f(m.value))
      case 'Nothing':
        return f => Nothing()
    }
  },
  getOrElse<A>(m: Maybe<A>): (f: () => A) => A {
    switch(m.type){
      case 'Just':
        return f => m.value
      case 'Nothing':
        return f => f()
    }
  },
  orElse<A>(m: Maybe<A>): (a: A) => A {
    switch(m.type){
      case 'Just':
        return a => m.value
      case 'Nothing':
        return a => a
    }
  },
  flatMap<A, B>(m: Maybe<A>): (f: (a: A) => Maybe<B>) => Maybe<B> {
    switch(m.type){
      case 'Just':
        return f => f(m.value);
      case 'Nothing':
        return f => Nothing();
    }
  },
  isJust<A>(a: Maybe<A>): Boolean {
    return Maybe.caseOf(a)({
      just: a => true,
      nothing: () => false
    });
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
