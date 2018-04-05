// @flow
import * as React from 'react'
import { equals } from 'ramda'
import warning from 'warning'
import { ZenFormConsumer } from './ZenFormContext'
import { getIn, isFunction, getValue } from './utils'
import type {
  CacheFieldProps,
  FieldProps as Props,
  ZenFormContext,
  FieldRenderProps,
} from '../typedef/types.js.flow'

class CacheField extends React.Component<CacheFieldProps> {
  shouldComponentUpdate(nextProps: CacheFieldProps) {
    if (
      equals(nextProps.value, this.props.value) &&
      equals(nextProps.error, this.props.error) &&
      equals(nextProps.data, this.props.data) &&
      nextProps.isTouched === this.props.isTouched &&
      nextProps.isActive === this.props.isActive
    ) {
      return false
    }
    return true
  }

  onChange = (event: SyntheticInputEvent<*>): void => {
    if (event.persist) {
      event.persist()
    }

    let { name } = event.target
    const { parse, passedValue, value } = this.props

    const val: any = getValue(event, value, passedValue)

    const parsedValue = parse ? parse(val) : val

    this.props.setFieldValue(name, parsedValue)
  }

  onBlur = (event: SyntheticFocusEvent<*>) => {
    if (event.persist) {
      event.persist()
    }

    const { name, setFieldTouched, setActiveField } = this.props

    setFieldTouched(name, true)
    setActiveField('')
  }

  onFocus = (event: SyntheticFocusEvent<*>) => {
    if (event.persist) {
      event.persist()
    }
    const { name, setActiveField } = this.props
    setActiveField(name)
  }

  render() {
    let {
      name,
      value,
      error,
      data,
      isTouched,
      isActive,
      setFieldValue,
      setFieldTouched,
      setActiveField,
      parse,
      allowNull,
      render,
      children,
      component,
      passedValue,
      ...restProps
    } = this.props
    const { onChange, onBlur, onFocus } = this

    if (value === null && !allowNull) {
      value = ''
    }

    let input = {
      name,
      value,
      onChange,
      onBlur,
      onFocus,
    }

    if ((restProps: Object).type === 'checkbox') {
      if (passedValue === undefined) {
        input = { ...input, checked: !!value }
      } else {
        input = { ...input, checked: !!(Array.isArray(value) && ~value.indexOf(passedValue)) }
        input.value = passedValue
      }
    } else if ((restProps: Object).type === 'radio') {
      input = { ...input, checked: value === passedValue }
      input.value = passedValue
    } else if (component === 'select' && (restProps: Object).multiple) {
      input.value = input.value || []
    }

    const meta = {
      error,
      data,
      isTouched,
      isActive,
    }

    const fieldRenderProps: FieldRenderProps = {
      input,
      meta,
    }

    warning(
      !(component && render),
      `In Field, You should not use <Field component={Component} /> and <Field render={() => <Component />} /> in the same <Field> component. 
only <Field component={Component} /> will be used`
    )

    warning(
      !(render && children),
      `In Field, You should not use <Field render={() => <Component />} /> and <Field>{() => <Component />}</Field> in the same <Field> component. 
only <Field render={() => <Component />} /> will be used`
    )

    warning(
      !(component && render && children),
      `In Field, You should not use <Field component={Component} />, 
<Field render={() => <Component />} /> and <Field>{() => <Component />}</Field>
in the same <Field> component. Only <Field component={Component} /> will be used`
    )

    warning(
      !!(render || children || component),
      `In Field, You should atleast provide either 
a component injection: <Field component={Component} />
a render prop : <Field render={() => <Component />} />
or a child as a function: <Field>{() => <Component />}</Field>`
    )

    warning(
      !!(children || component || !render || isFunction(render)),
      `In Field, render should be a function: <Field render={() => <Component />} />`
    )

    warning(
      !!(render || component || !children || isFunction(children)),
      `In Field, child should be a function: <Field>{() => <Component />}</Field>`
    )

    if (component) {
      if (typeof component === 'string') {
        return React.createElement(component, { ...input, children, ...restProps })
      }

      return React.createElement(component, { ...input, meta, children, ...restProps })
    }

    if (render && isFunction(render)) {
      return render(fieldRenderProps)
    }

    if (children && isFunction(children)) {
      return children(fieldRenderProps)
    }

    return null
  }
}

const Field = ({
  name,
  format = (value: any) => (value === undefined ? '' : value),
  parse = (value: any) => (value === undefined ? '' : value),
  allowNull = false,
  value: passedValue,
  ...restProps
}: Props) => (
  <ZenFormConsumer>
    {({
      setFieldValue,
      setFieldTouched,
      setActiveField,
      values,
      errors,
      touched,
      data,
      activeField,
    }: ZenFormContext) => {
      const value = getIn(values, name)
      const formattedValue = format ? format(value) : value
      const error = getIn(errors, name)
      const isTouched = getIn(touched, name) || false
      const fieldData = getIn(data, name)
      const isActive = activeField === name
      return (
        <CacheField
          name={name}
          value={formattedValue}
          passedValue={passedValue}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          setActiveField={setActiveField}
          parse={parse}
          error={error}
          data={fieldData}
          isTouched={isTouched}
          isActive={isActive}
          allowNull={allowNull}
          {...restProps}
        />
      )
    }}
  </ZenFormConsumer>
)

export default Field
