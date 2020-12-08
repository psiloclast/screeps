// https://stackoverflow.com/a/60142095
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

// https://github.com/piotrwitek/utility-types/blob/master/src/mapped-types.ts#L562
export type ValuesType<
  T extends readonly any[] | ArrayLike<any> | Record<any, any>
> = T extends readonly any[]
  ? T[number]
  : T extends ArrayLike<any>
  ? T[number]
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends object
  ? T[keyof T]
  : never;
