// const useConfig =
//   <T extends Record<string, Feature>>(features: T) =>
//   <KS extends Array<keyof T>>(
//     tag: Tags,
//     ...features: { [I in keyof KS]-?: [KS[I], ...Parameters<T[Extract<KS[I], keyof T>]>] }
//   ): void =>
//     void 0;

// // https://stackoverflow.com/questions/51502671/typescript-getting-the-type-of-object-key-inside-object-itself

// type Type<T, K extends keyof T> = {
//   attr: K;
//   feature: (value: T[K]) => void;
// };

// // generic func
// const typeFor =
//   <T>() =>
//   <K extends keyof T>(type: Type<T, K>) =>
//     type;

// // T is specified manually
// const typeForVar1StringVar2Number = typeFor<{ var1: string; var2: number }>();

// // K is inferred from the argument
// const Test2 = typeForVar1StringVar2Number({ attr: 'var1', feature: (val) => null });

// type ValueOf<T> = T[keyof T];
// type Pair<T, K extends keyof T> = [K, T[K]];

// const typeFor =
//   <T>() =>
//   <K extends keyof T>(type: K) =>
//     type;

// type FeatureProp<T> = <K extends keyof T>(k: K) => K;

// type Defaults<T, D extends keyof T> = [D, T & Pick<T, D>];
// const features =
//   <T extends Record<string, string>>(...f: T[]) =>
//   (u: Defaults<T, keyof T>): any =>
//     null;

// const test = features({
//   attr: 'id',
//   style: 'font',
// });

// test(['attr', {attr:'df'});

// const features =
//   <T extends Record<string, string>>(...f: T[]) =>
//   (u: Parameters<<O extends T, K extends keyof O, V extends O[K]>(k: K, v: ValueOf<O>) => void>): any =>
//     null;

// const test = features({
//   attr: 'id',
//   style: 'font',
// });

// test(['attr', '']);

// type Mappers<Obj> = {
//   [K in keyof Obj]: Obj[K];
// };

// const foo =
//   <F extends Record<string, string>>(o: F) =>
//   (k: Mappers<F>): void =>
//     null;

// foo({
//   attr: 'id',
//   style: 'font',
// })({ attr: 'asdf' });

// export const useConfig =
//   <T extends Record<string, (...a: any) => null>>(features: T) =>
//   (...args: { [K in keyof T]-?: [K, ...Parameters<T[K]>] }[keyof T][]): void =>
//     void 0;

// const config = useConfig({
//   attr: (prop: 'id', val: string) => null,
//   style: (prop: 'font', val: 'arial') => null,
// });

// const t = config(
//   ['attr', 'id', 'asdf'],
//   ['style', 'id', 'asdf'],
//   //~~~~~~~~~~~~~~~~~~
// );

export const useConfig =
  <T extends Record<string, (...a: any) => null>>(features: T) =>
  <KS extends Array<keyof T>>(
    ...args: { [I in keyof KS]-?: [KS[I], ...Parameters<T[Extract<KS[I], keyof T>]>] }
  ): void =>
    void 0;

const config = useConfig({
  attr: (prop: 'id', val: string) => null,
  style: (prop: 'font', val: 'arial') => null,
});

const t = config(['attr', 'id', 'asdf']);
