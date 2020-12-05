import { Entries } from "./types";

export const typedKeyObjectEntries = <T>(obj: T): Entries<T> => {
  return Object.entries(obj) as any;
};
