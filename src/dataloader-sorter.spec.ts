import DataLoader from 'dataloader'
import {dataLoaderSorter} from './dataloader-sorter'

describe('dataLoaderSorter', function () {
  const key = 'id'

  it('in: 3, null: 1, out: 3', function () {
    const input = [1, 2, 3]
    const result = [{id: 1}, {id: 3}]
    const loader = new DataLoader(async (ids: number[]) => {
      const sorter = dataLoaderSorter<any, any>(ids, key)

      return sorter(result)
    })
    const missingCount = input.length - result.length

    let count = 0
    const promises = input.map(
      i => loader.load(i).then(
        ii => {
          if (ii !== undefined) {
            expect(ii[key]).toEqual(i)
          } else {
            count++
          }
        },
      ),
    )

    return Promise.all(promises).then(() => {
      expect(count).toEqual(missingCount)
    })
  })
  it('shuffle: in: 50, null: 10, out: 50', function () {
    const input = array(50).map((_, i) => 49 - i)
    const result = array(40).map((_, i) => ({[key]: i + 10}))
    const loader = new DataLoader(async (ids: number[]) => {
      const sorter = dataLoaderSorter<any, any>(ids, key)

      return sorter(result)
    })
    const missingCount = input.length - result.length
    let count = 0

    return Promise.all(
      input.map(
        i => loader.load(i).then(
          ii => {
            if (ii !== undefined) {
              expect(ii[key]).toEqual(i)
            } else {
              count++
            }
          },
        ),
      ),
    )
      .then(() => {
        expect(count).toEqual(missingCount)
      })
  })
  it('dupication: in: 50, null: 10, out: 50', function () {
    const input = array(50).map((_, i) => i)
    input[30] = 10
    input[31] = 11
    const result = array(40).map((_, i) => ({[key]: i + 10}))
    const loader = new DataLoader(async (ids: number[]) => {
      const sorter = dataLoaderSorter<any, any>(ids, key)

      return sorter(result)
    })
    const missingCount = input.length - result.length
    let count = 0

    return Promise.all(
      input.map(
        i => loader.load(i).then(
          ii => {
            if (ii !== undefined) {
              expect(ii[key]).toEqual(i)
            } else {
              count++
            }
          },
        ),
      ),
    )
      .then(() => {
        expect(count).toEqual(missingCount)
      })
  })
  describe('nested', function () {
    it('dupication: in: 50, null: 10, out: 50', function () {
      const input = array(50).map((_, i) => i)
      input[30] = 10
      input[31] = 11
      const result = array(40).map((_, i) => [{[key]: i + 10}])
      const loader = new DataLoader(async (ids: number[]) => {
        const sorter = dataLoaderSorter<any, any>(ids, key)

        return sorter(result)
      })
      const missingCount = input.length - result.length
      let count = 0

      return Promise.all(
        input.map(
          i => {
            return loader.load(i).then(
              ii => {
                if (ii !== undefined && ii[0] !== undefined) {
                  expect(ii[0]).toEqual({[key]: i})
                } else {
                  count++
                }
              },
            )
          },
        ),
      )
        .then(() => {
          expect(count).toEqual(missingCount)
        })
    })
  })

  function array(count: number) {
    return Array(count).fill(0)
  }
})
