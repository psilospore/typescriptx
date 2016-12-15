
export type Either<L, R> = Left<L> | Right<R>;

export interface Left<L> {
  type: 'Left';
  left: L;
}

export interface Right<R> {
  type: 'Right';
  right: R;
}

type CaseMatcher<L, R, Z> = {
  left:  (l: L) => Z,
  right: (r: R) => Z
};

export class EitherDecorator<L, R> {
  private e: Either<L, R>;

  constructor(e: Either<L, R>) {
    this.e = e;
  }
  un(): Either<L, R> {
    return this.e;
  }
  caseOf<Z>(m: CaseMatcher<L, R, Z>): Z {
    switch(this.e.type) {
      case 'Left':
        return m.left(this.e.left);
      case 'Right':
        return m.right(this.e.right);
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
  isLeft<L, R>(): Boolean {
    return !this.isRight();
  }
}

export function E<L, R>(e: Either<L, R>): EitherDecorator<L, R> {
  return new EitherDecorator(e);
}

export function Left<L>(l: L): Left<L> {
  return {
    type: 'Left',
    left: l
  };
};

export function Right<R>(r: R): Right<R> {
  return {
    type: 'Right',
    right: r
  };
}
