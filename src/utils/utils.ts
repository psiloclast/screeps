import { Entries } from "./types";

export const typedKeyObjectEntries = <T>(obj: T): Entries<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.entries(obj) as any;
};

export type Predicate<T> = (x: T) => boolean;

export const composePredicates = <T>(p1: Predicate<T>, p2?: Predicate<T>) => (
  x: T,
): boolean => p1(x) && (p2 ? p2(x) : true);
