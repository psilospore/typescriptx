
export function compose<A, B, C>(f: (a: A) => B, g: (B: B) => C): (a: A) => C {
  return (a: A) => g(f(a));
}

export function identity<A>(a: A): A {
    return a;
}
