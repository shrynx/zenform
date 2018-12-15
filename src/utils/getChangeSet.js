// @flow
import { difference, intersection, equals } from 'ramda'

const getChangeSet = (
  origData: any[],
  finalData: any[],
  id: string
): ?{ changes: any[], additions: any[], deletions: any[] } => {
  if (origData.length === 0) {
    return null
  } else {
    const [nonAdditions, additions] = finalData.reduce(
      (acc, curr) => {
        const [na, a] = acc

        return curr[id] === undefined ? [na, [...a, curr]] : [[...na, curr], a]
      },
      [[], []]
    )

    const getIds = arr => {
      return arr.map(ele => ele[id])
    }

    const finalNonAdditionIds = getIds(nonAdditions)
    const orignalIds = getIds(origData)

    const deletionsIds = difference(orignalIds, finalNonAdditionIds)
    const deletions = deletionsIds.map(dId => origData.filter(od => od[id] === dId)[0])

    const commonIds = intersection(finalNonAdditionIds, orignalIds)

    const [commonOrignal, commonFinal] = commonIds.reduce(
      (acc, curr) => {
        const [co, cf] = acc

        return [
          [...co, ...origData.filter(od => od[id] === curr)],
          [...cf, ...nonAdditions.filter(na => na[id] === curr)],
        ]
      },
      [[], []]
    )

    commonIds.map(cId => [
      [...origData.filter(od => od[id] === cId)],
      [...nonAdditions.filter(od => od[id] === cId)],
    ])

    const changes = commonIds.reduce((acc, curr, index) => {
      const co = commonOrignal[index]
      const cf = commonFinal[index]

      return !equals(co, cf) ? [...acc, cf] : acc
    }, [])

    return {
      additions,
      deletions,
      changes,
    }
  }
}

export default getChangeSet
