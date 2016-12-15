
export type Either<L, R> = Left<L> | Right<R>;

export interface Left<L> {
  type: 'Left';
  value: L;
}

export interface Right<R> {
  type: 'Right';
  value: R;
}

type CaseMatcher<L, R, Z> = {
  left:  (l: L) => Z,
  right: (r: R) => Z
};

class EitherDecorator<L, R> {
  private e: Either<L, R>;

  constructor(e: Either<L, R>) {
    this.e = e;
  }
  caseOf<Z>(m: CaseMatcher<L, R, Z>): Z {
    switch(this.e.type) {
      case 'Left':
        return m.left(this.e.value);
      case 'Right':
        return m.right(this.e.value);
    }
  }
  flatMap<RR>(f: (r: R) => Either<L, RR>): EitherDecorator<L, RR> {
    return this.caseOf({
      left: l => E<L, RR>(Left(l)),
      right: r => E<L, RR>(f(r))
    });
  }
  map<RR>(f: (r: R) => RR): EitherDecorator<L, RR> {
    return this.caseOf({
      left: l => E<L, RR>(Left(l)),
      right: r => E<L, RR>(Right(f(r)))
    });
  }
  isRight<L, R>(): Boolean {
    return this.caseOf({
      left:  l => false,
      right: r => true
    });
  }
  isLeft<L, R>(e: Either<L, R>): Boolean {
    return !this.isRight();
  }
}

export function E<L, R>(e: Either<L, R>): EitherDecorator<L, R> {
  return new EitherDecorator(e);
}

export function Left<L>(l: L): Left<L> {
  return {
    type: 'Left',
    value: l
  };
};

export function Right<R>(r: R): Right<R> {
  return {
    type: 'Right',
    value: r
  };
}