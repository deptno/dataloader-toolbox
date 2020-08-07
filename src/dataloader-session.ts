import DataLoader, {BatchLoadFn} from 'dataloader'

export function createDataLoaderSession(): DataLoaderSession {
  const set = new WeakMap()

  return (fx) => {
    if (!set.has(fx)) {
      set.set(fx, new DataLoader(fx))
    }
    return set.get(fx)
  }
}
export type DataLoaderSession = <T extends BatchLoadFn<GetK<T>, GetV<T>>>(fx: T) => DataLoader<GetK<T>, GetV<T>>

type GetK<T extends Function> = T extends (keys: ReadonlyArray<infer K>) => any
  ? K
  : unknown
type GetV<T extends Function> = T extends (keys: ReadonlyArray<any>) => PromiseLike<ArrayLike<infer V | Error>>
  ? V
  : unknown