// @flow
import * as React from 'react'
import { equals } from 'ramda'
import warning from 'warning'
import { ZenFormProvider } from './ZenFormContext'
import { setIn, isPromise, isFunction, setNestedValues } from './utils'
import type { FormProps as Props, ZenFormContext, FormRenderProps, FormActions } from '../typedef/types.js.flow'

type State = {
  values: Object,
  errors: Object,
  touched: Object,
  data: Object,
  activeField: string,
  isSubmitting: boolean,
}

class Form extends React.Component<Props, State> {
  initialValues = this.props.initialValues || {}

  initialState = {
    values: this.initialValues,
    errors: {},
    touched: {},
    data: {},
    activeField: '',
    isSubmitting: false,
  }

  static defaultProps = {
    initialValues: {},
    validations: () => {},
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {},
  }

  state = this.initialState

  setFieldValue = (field: string, value: any): void => {
    const { values } = this.state

    const updatedValues = setIn(values, field, value)
    this.setState({ values: updatedValues })

    const { validateOnChange } = this.props

    if (validateOnChange) {
      this.runValidations(updatedValues)
    }
  }

  setMultipleFieldValues = (
    fieldValues: Array<{
      field: string,
      value: any,
    }>
  ): void => {
    const { values } = this.state
    let updatedValues = values
    fieldValues.forEach(({ field, value }) => {
      updatedValues = setIn(updatedValues, field, value)
    })
    this.setState({ values: updatedValues })
    const { validateOnChange } = this.props

    if (validateOnChange) {
      this.runValidations(updatedValues)
    }
  }

  setFieldError = (field: string, error: any): void => {
    const { errors } = this.state
    const updatedErrors = setIn(errors, field, error)
    this.setState({ errors: updatedErrors })
  }

  setMultipleFieldErrors = (
    fieldErrors: Array<{
      field: string,
      error: any,
    }>
  ): void => {
    const { errors } = this.state
    let updatedErrors = errors
    fieldErrors.forEach(({ field, error }) => {
      updatedErrors = setIn(updatedErrors, field, error)
    })
    this.setState({ errors: updatedErrors })
  }

  setFieldTouched = (field: string, isTouched: boolean): void => {
    const { touched } = this.state
    const updatedTouched = setIn(touched, field, isTouched)
    this.setState({ touched: updatedTouched })

    const { validateOnBlur } = this.props
    if (validateOnBlur) {
      this.runValidations(this.state.values)
    }
  }

  setMultipleFieldTouched = (
    fieldTouched: Array<{
      field: string,
      isTouched: boolean,
    }>
  ): void => {
    const { touched } = this.state
    let updatedTouched = touched
    fieldTouched.forEach(({ field, isTouched }) => {
      updatedTouched = setIn(updatedTouched, field, isTouched)
    })
    this.setState({ touched: updatedTouched })

    const { validateOnBlur } = this.props
    if (validateOnBlur) {
      this.runValidations(this.state.values)
    }
  }

  setFieldData = (field: string, data: any): void => {
    const updatedData = setIn(this.state.data, field, data)
    this.setState({ errors: updatedData })
  }

  setMultipleFieldData = (
    fieldData: Array<{
      field: string,
      data: any,
    }>
  ): void => {
    let updatedData = this.state.data
    fieldData.forEach(({ field, data }) => {
      updatedData = setIn(updatedData, field, data)
    })
    this.setState({ data: updatedData })
  }

  setActiveField = (field: string) => {
    this.setState({ activeField: field })
  }

  setZenFormState = (newState: any, callback?: () => void = () => {}) => {
    this.setState(newState, callback)
  }

  setSubmitting = (isSubmitting: boolean) => {
    this.setState({ isSubmitting })
  }

  runValidations = (values: any) => {
    const { validations } = this.props

    if (validations) {
      const maybePromisedErrors = validations(values) || {}
      if (isPromise(maybePromisedErrors)) {
        maybePromisedErrors.then(
          () => {
            this.setState({ errors: {} })
          },
          errors => this.setState({ errors, isSubmitting: false })
        )
      } else {
        this.setState({ errors: maybePromisedErrors })
      }
    }
  }

  handleSubmit = (event?: SyntheticEvent<HTMLFormElement>) => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault()
    }
    const { values } = this.state
    const { onSubmit, validations } = this.props
    this.setState({
      isSubmitting: true,
    })
    if (validations) {
      const maybePromisedErrors = validations(values) || {}
      if (isPromise(maybePromisedErrors)) {
        maybePromisedErrors.then(
          () => {
            this.setState({ errors: {} })
            onSubmit(values, this.getFormActions())
          },
          errors =>
            this.setState({ errors, touched: setNestedValues(errors, true), isSubmitting: false })
        )
      } else {
        const isValid = Object.keys(maybePromisedErrors).length === 0
        this.setState({
          errors: maybePromisedErrors,
          touched: setNestedValues(maybePromisedErrors, true),
          isSubmitting: isValid,
        })

        if (isValid) {
          onSubmit(values, this.getFormActions())
        }
      }
    } else {
      onSubmit(values, this.getFormActions())
    }
  }

  resetForm = () => {
    this.setState(this.initialState)
  }

  getFormActions = (): FormActions => {
    return {
      setFieldValue: this.setFieldValue,
      setMultipleFieldValues: this.setMultipleFieldValues,
      setFieldError: this.setFieldError,
      setMultipleFieldErrors: this.setMultipleFieldErrors,
      setFieldTouched: this.setFieldTouched,
      setMultipleFieldTouched: this.setMultipleFieldTouched,
      setFieldData: this.setFieldData,
      setMultipleFieldData: this.setMultipleFieldData,
      setActiveField: this.setActiveField,
      setZenFormState: this.setZenFormState,
      runValidations: this.runValidations,
      resetForm: this.resetForm,
      setSubmitting: this.setSubmitting
    }
  }

  render() {
    const { values, errors, touched, activeField, data } = this.state

    const {
      setFieldValue,
      setMultipleFieldValues,
      initialValues,
      setFieldError,
      setMultipleFieldErrors,
      setFieldTouched,
      setMultipleFieldTouched,
      setFieldData,
      setMultipleFieldData,
      setActiveField,
      setZenFormState,
      handleSubmit,
      resetForm,
    } = this

    const isDirty: boolean = !equals(values, initialValues)
    const isInvalid: boolean = Object.keys(errors).length !== 0

    const contextValues: ZenFormContext = {
      values,
      errors,
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
      setZenFormState,
    }

    const formRenderProps: FormRenderProps = {
      values,
      errors,
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
      handleSubmit,
      resetForm,
      isDirty,
      isInvalid,
      initialValues,
    }

    const { render, children } = this.props

    warning(
      !(render && children),
      `In Form, You should not use <Form render={() => <Component />}> and <Form>{() => <Component />}</Form>
in the same <Form> component. Only <Form render={() => <Component />}> will be used`
    )

    warning(
      !!(render || children),
      `In Form, You should atleast provide either
a render prop : <Form render={() => <Component />}>
or a child as a function: <Form>{() => <Component />}</Form>`
    )

    warning(
      !!(children || !render || isFunction(render)),
      `In Form, render prop should be a function: <Form render={() => <Component />}>.`
    )

    warning(
      !!(render || !children || isFunction(children)),
      `In Form, child should be a function: <Form>{() => <Component />}</Form>`
    )

    return (
      <ZenFormProvider value={contextValues}>
        {render && isFunction(render)
          ? render(formRenderProps)
          : children && isFunction(children) ? children(formRenderProps) : null}
      </ZenFormProvider>
    )
  }
}

export default Form
