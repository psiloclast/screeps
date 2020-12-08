import { Entries } from "./types";

export const typedKeyObjectEntries = <T>(obj: T): Entries<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.entries(obj) as any;
};
