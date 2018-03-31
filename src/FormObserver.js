// @flow
import React from 'react'
import { equals } from 'ramda'
import { ZenFormConsumer } from './ZenFormContext'
import type {
  ZenFormContext,
  FormObserverProps,
  FormObserverAuxProps,
  FormObserverData,
} from '../typedef/types.js.flow'

class FormObserverAux extends React.Component<FormObserverAuxProps> {
  shouldComponentUpdate({ values }) {
    const { values: previousValues } = this.props

    if (!equals(values, previousValues)) {
      return true
    }
    return false
  }

  componentDidUpdate({ values: previousValues }) {
    const {
      values,
      onChange,
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

    const formObserverData: FormObserverData = {
      values,
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

    if (!equals(values, previousValues)) {
      onChange(formObserverData)
    }
  }

  render() {
    return null
  }
}

const FormObserver = ({ onChange = () => {} }: FormObserverProps) => (
  <ZenFormConsumer>
    {({
      values,
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
      return (
        <FormObserverAux
          values={values}
          onChange={onChange}
          activeField={activeField}
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

export default FormObserver
