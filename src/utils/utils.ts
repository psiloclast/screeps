import { Entries } from "./types";

export const typedKeyObjectEntries = <T>(obj: T): Entries<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.entries(obj) as any;
};

export type Predicate<T> = (x: T) => boolean;

export const liftNot = <T>(p: Predicate<T>) => (x: T): boolean => !p(x);

export const liftAnd = <T>(p1: Predicate<T>, p2: Predicate<T>) => (
  x: T,
): boolean => p1(x) && p2(x);

export const liftOr = <T>(p1: Predicate<T>, p2: Predicate<T>) => (
  x: T,
): boolean => p1(x) || p2(x);

// https://fettblog.eu/typescript-hasownproperty/
// eslint-disable-next-line @typescript-eslint/ban-types
export const hasOwnProperty = <T extends {}, P extends PropertyKey>(
  obj: T,
  property: P,
  // eslint-disable-next-line no-prototype-builtins
): obj is T & Record<P, unknown> => obj.hasOwnProperty(property);

export const mapByKey = <T>(
  xs: T[],
  keyFn: (t: T) => string,
): Record<string, T> => {
  const numOfEachKey: Record<string, number> = {};
  const numSuffix = (k: string): number =>
    numOfEachKey[k] !== undefined ? ++numOfEachKey[k] : (numOfEachKey[k] = 0);
  return xs.reduce((acc, x) => {
    const key = keyFn(x);
    return {
      ...acc,
      [`${key}-${numSuffix(key)}`]: x,
    };
  }, {} as Record<string, T>);
};
