// @flow

export const isInteger = (val: mixed) => String(Math.floor(Number(val))) === val

export const isFunction = (value: mixed) => {
  const functionTag = '[object Function]'
  return typeof value === 'function' || Object.prototype.toString.call(value) === functionTag
}

export const isObject = (obj: mixed) => obj !== null && typeof obj === 'object'

export const isPromise = (value: any): boolean => isObject(value) && isFunction(value.then)
