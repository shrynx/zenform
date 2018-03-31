// @flow
import { isObject } from './isType'

function setNestedValues<T>(
  object: any,
  value: any,
  visited: any = new WeakMap(),
  response: any = {}
): T {
  for (let k of Object.keys(object)) {
    const val = object[k]
    if (isObject(val)) {
      if (!visited.get(val)) {
        visited.set(val, true)
        response[k] = Array.isArray(val) ? [] : {}
        setNestedValues(val, value, visited, response[k])
      }
    } else {
      response[k] = value
    }
  }

  return response
}

export default setNestedValues
