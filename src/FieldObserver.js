// @flow
import React from 'react'
import { equals } from 'ramda'
import { ZenFormConsumer } from './ZenFormContext'
import { getIn } from './utils'
import type {
  ZenFormContext,
  FieldObserverProps,
  ObserverProps,
  FieldObserverData,
} from '../typedef/types.js.flow'

class Observer extends React.Component<ObserverProps> {
  shouldComponentUpdate({ value, isActive, isTouched }) {
    const { value: previousValue, isActive: previouslyActive } = this.props

    if (!equals(value, previousValue) || isActive !== previouslyActive) {
      return true
    }
    return false
  }

  componentDidUpdate({ value: previousValue, isActive: previouslyActive }) {
    const {
      name,
      formValues,
      value,
      isTouched,
      data,
      isActive,
      onChange,
      onBlur,
      onFocus,
      setFieldValue,
      setMultipleFieldValues,
      setFieldError,
      setMultipleFieldErrors,
      setFieldTouched,
      setMultipleFieldTouched,
      setFieldData,
      setMultipleFieldData,
      setActiveField,
    } = this.props

    const observerData: FieldObserverData = {
      name,
      formValues,
      value,
      isTouched,
      data,
      isActive,
      setFieldValue,
      setMultipleFieldValues,
      setFieldError,
      setMultipleFieldErrors,
      setFieldTouched,
      setMultipleFieldTouched,
      setFieldData,
      setMultipleFieldData,
      setActiveField,
    }

    if (!equals(value, previousValue)) {
      onChange(observerData)
    }

    if (previouslyActive === false && isActive !== previouslyActive) {
      onFocus(observerData)
    }

    if (previouslyActive === true && isActive !== previouslyActive) {
      onBlur(observerData)
    }
  }

  render() {
    return null
  }
}

const FieldObserver = ({
  name,
  onChange = () => {},
  onBlur = () => {},
  onFocus = () => {},
}: FieldObserverProps) => (
  <ZenFormConsumer>
    {({
      values,
      touched,
      data,
      activeField,
      setFieldValue,
      setMultipleFieldValues,
      setFieldError,
      setMultipleFieldErrors,
      setFieldTouched,
      setMultipleFieldTouched,
      setFieldData,
      setMultipleFieldData,
      setActiveField,
    }: ZenFormContext) => {
      const value = getIn(values, name)
      const isTouched = getIn(touched, name) || false
      const fieldData = getIn(data, name)
      const isActive = activeField === name

      return (
        <Observer
          name={name}
          formValues={values}
          value={value}
          isTouched={isTouched}
          data={fieldData}
          isActive={isActive}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          setFieldValue={setFieldValue}
          setMultipleFieldValues={setMultipleFieldValues}
          setFieldError={setFieldError}
          setMultipleFieldErrors={setMultipleFieldErrors}
          setFieldTouched={setFieldTouched}
          setMultipleFieldTouched={setMultipleFieldTouched}
          setFieldData={setFieldData}
          setMultipleFieldData={setMultipleFieldData}
          setActiveField={setActiveField}
        />
      )
    }}
  </ZenFormConsumer>
)

export default FieldObserver
