declare const _brand: unique symbol;
export type Brand<T, TBrand> = T & { [_brand]: TBrand };

export type LooseToStrict<T> = T extends any ? string extends T ? never
  : T
  : never;

export type Prettify<T> =
  & {
    [K in keyof T]: T[K];
  }
  & {};
