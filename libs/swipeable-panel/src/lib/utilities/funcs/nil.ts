export function isNil(val: unknown): val is null | undefined {
  return val === null || val === undefined;
}

export function notNil<T>(val: T): val is NonNullable<T> {
  return !isNil(val);
}
