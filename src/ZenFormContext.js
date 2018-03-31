// @flow
import createReactContex from 'create-react-context'
import type { ZenFormContext } from '../typedef/types.js.flow'

const defaultContext: ZenFormContext = {
  values: {},
  errors: {},
  touched: {},
  data: {},
  activeField: '',
  setFieldValue: () => {},
  setMultipleFieldValues: () => {},
  setFieldError: () => {},
  setMultipleFieldErrors: () => {},
  setFieldTouched: () => {},
  setMultipleFieldTouched: () => {},
  setFieldData: () => {},
  setMultipleFieldData: () => {},
  setActiveField: () => {},
  setZenFormState: () => {},
}

export const { Provider: ZenFormProvider, Consumer: ZenFormConsumer } = createReactContex(
  defaultContext
)
