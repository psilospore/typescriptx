
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

export const Either = {
  caseOf<L, R, Z>(e: Either<L, R>): (c: CaseMatcher<L, R, Z>) => Z {
    switch(e.type) {
      case 'Left':
        return c => c.left(e.value);
      case 'Right':
        return c => c.right(e.value);
    }
  },
  flatMap<L, R, RR>(e: Either<L, R>): (f: (r: R) => Either<L, RR>) => Either<L, RR> {
    switch(e.type) {
      case 'Left':
        return f => e;
      case 'Right':
        return f => f(e.value);
    }
  },
  map<L, R, RR>(e: Either<L, R>): (f: (r: R) => RR) => Either<L, RR> {
    switch(e.type) {
      case 'Left':
        return f => e;
      case 'Right':
        return f => Right(f(e.value));
    }
  },
  isRight<L, R>(e: Either<L, R>): Boolean {
    return Either.caseOf<L, R, Boolean>(e)({
      left:  l => false,
      right: r => true
    });
  },
  isLeft<L, R>(e: Either<L, R>): Boolean {
    return !Either.isRight<L, R>(e);
  }
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
