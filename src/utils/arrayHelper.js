// @flow
export const move = (array: Array<any>, from: number, to: number) => {
  const copy = [...(array || [])]
  const value = copy[from]
  copy.splice(from, 1)
  copy.splice(to, 0, value)
  return copy
}

export const swap = (array: Array<any>, indexA: number, indexB: number) => {
  const copy = [...(array || [])]
  const a = copy[indexA]
  copy[indexA] = copy[indexB]
  copy[indexB] = a
  return copy
}

export const insert = (array: Array<any>, index: number, value: any) => {
  const copy = [...(array || [])]
  copy.splice(index, 0, value)
  return copy
}

export const replace = (array: Array<any>, index: number, value: any) => {
  const copy = [...(array || [])]
  copy[index] = value
  return copy
}
