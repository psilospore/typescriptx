
export function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return a => f(g(a));
}

export function identity<A>(a: A): A {
    return a;
}

// curry?
export function curry<A, B, C>(f: (a:A, b:B) => C): (a:A) => (b:B) => C  {
  return (a:A) => (b:B) => f(a, b);
}
