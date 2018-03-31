// @flow
import toPath from './toPath'

const getIn = (state: Object, complexKey: string): any => {
  const path = toPath(complexKey)
  let current: any = state
  for (let key of path) {
    if (
      current === undefined ||
      current === null ||
      typeof current !== 'object' ||
      (Array.isArray(current) && isNaN(key))
    ) {
      return undefined
    }
    current = current[key]
  }
  return current
}

export default getIn
