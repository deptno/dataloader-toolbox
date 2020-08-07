export const dataLoaderSorter =
  <T, Y extends keyof T>(order: ReadonlyArray<ValueType<T, Y>>, key: Y) =>
    (items: T[]): T[] => {
      const nested = Array.isArray(items[0])

      if (nested) {
        return order.map(id => items.find(t => {
          if (t[0]) {
            return t[0][key] === id
          }
          return false
        }))
      }
      return order.map(id => items.find(t => t[key] === id))
    }

type ValueType<T, K> = K extends keyof T
  ? T[K]
  : unknown
