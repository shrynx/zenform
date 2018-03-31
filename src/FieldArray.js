// @flow
import React from 'react'
import warning from 'warning'
import { ZenFormConsumer } from './ZenFormContext'
import { getIn, setIn, isFunction, move, swap, insert, replace } from './utils'
import type {
  ZenFormContext,
  FieldArrayProps,
  AuxFieldArrayProps,
  FieldArrayRenderProps,
} from '../typedef/types.js.flow'

class AuxFieldArray extends React.Component<AuxFieldArrayProps> {
  updateArrayField = (
    fn: Function,
    alterTouched: boolean,
    alterErrors: boolean,
    alterData: boolean
  ) => {
    const { name, values, errors, touched, data, setZenFormState } = this.props
    setZenFormState(prevState => ({
      ...prevState,
      values: setIn(prevState.values, name, fn(getIn(values, name))),
      errors: alterErrors
        ? setIn(prevState.errors, name, fn(getIn(errors, name)))
        : prevState.errors,
      touched: alterTouched
        ? setIn(prevState.touched, name, fn(getIn(touched, name)))
        : prevState.touched,
      data: alterData ? setIn(prevState.data, name, fn(getIn(data, name))) : prevState.data,
    }))
  }

  getArrayValues = (): Array<any> => {
    const { name, values } = this.props
    const value = getIn(values, name)
    return Array.isArray(value) ? value : []
  }

  forEach = (iterator: (name: string, index: number) => void): void => {
    const { name } = this.props
    const length = this.getArrayValues().length
    for (let i = 0; i < length; i++) {
      iterator(`${name}[${i}]`, i)
    }
  }

  map = (iterator: (name: string, index: number) => any): Array<any> => {
    const { name } = this.props
    const length = this.getArrayValues().length
    const results: Array<any> = []
    for (let i = 0; i < length; i++) {
      results.push(iterator(`${name}[${i}]`, i))
    }
    return results
  }

  push = (value: any) =>
    this.updateArrayField((array: Array<any>) => [...(array || []), value], false, false, false)

  swap = (indexA: number, indexB: number) =>
    this.updateArrayField((array: Array<any>) => swap(array, indexA, indexB), false, false, false)

  move = (from: number, to: number) =>
    this.updateArrayField((array: Array<any>) => move(array, from, to), false, false, false)

  insert = (index: number, value: any) =>
    this.updateArrayField((array: Array<any>) => insert(array, index, value), false, false, false)

  replace = (index: number, value: any) =>
    this.updateArrayField((array: Array<any>) => replace(array, index, value), false, false, false)

  unshift = (value: any) => {
    let arr = []
    this.updateArrayField(
      (array: Array<any>) => {
        arr = array ? [value, ...array] : [value]
        return arr
      },
      false,
      false,
      false
    )
    return arr.length
  }

  remove = (index: number) => {
    let result: any
    this.updateArrayField(
      (array?: Array<any>) => {
        const copy = array ? [...array] : []
        if (!result) {
          result = copy[index]
        }
        if (isFunction(copy.splice)) {
          copy.splice(index, 1)
        }
        return copy
      },
      true,
      true,
      true
    )

    return result
  }

  pop = () => {
    let result: any
    this.updateArrayField(
      (array: Array<any>) => {
        const tmp = array
        if (!result) {
          result = tmp && tmp.pop && tmp.pop()
        }
        return tmp
      },
      true,
      true,
      true
    )

    return result
  }

  render() {
    const { name } = this.props

    const arrayHelpers = {
      forEach: this.forEach,
      map: this.map,
      push: this.push,
      pop: this.pop,
      swap: this.swap,
      move: this.move,
      insert: this.insert,
      replace: this.replace,
      unshift: this.unshift,
      remove: this.remove,
    }

    const fieldArrayRenderProps: FieldArrayRenderProps = {
      fields: {
        name,
        arrayValues: this.getArrayValues(),
        ...arrayHelpers,
      },
    }

    const { render, children } = this.props

    warning(
      !(render && children),
      `In FieldArray, You should not use <FieldArray render={() => <Component />}> and <FieldArray>{() => <Component />}</FieldArray>
in the same <FieldArray> component. Only <FieldArray render={() => <Component />}> will be used`
    )

    warning(
      !!(render || children),
      `In FieldArray, You should atleast provide either
a render prop : <FieldArray render={() => <Component />}>
or a child as a function: <FieldArray>{() => <Component />}</FieldArray>`
    )

    warning(
      !!(children || !render || isFunction(render)),
      `In FieldArray, render prop should be a function: <FieldArray render={() => <Component />}>.`
    )

    warning(
      !!(render || !children || isFunction(children)),
      `In FieldArray, child should be a function: <FieldArray>{() => <Component />}</FieldArray>`
    )

    if (render && isFunction(render)) {
      return render(fieldArrayRenderProps)
    }
    if (children && isFunction(children)) {
      return children(fieldArrayRenderProps)
    }
    return null
  }
}

const FieldArray = ({ name, ...restProps }: FieldArrayProps) => {
  return (
    <ZenFormConsumer>
      {({ setZenFormState, values, errors, touched, data }: ZenFormContext) => {
        return (
          <AuxFieldArray
            name={name}
            values={values}
            errors={errors}
            touched={touched}
            data={data}
            setZenFormState={setZenFormState}
            {...restProps}
          />
        )
      }}
    </ZenFormConsumer>
  )
}

export default FieldArray
