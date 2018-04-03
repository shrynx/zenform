![logo](https://user-images.githubusercontent.com/4706261/38170869-6f2aa9f0-35ac-11e8-8c2d-d54fce419e75.png)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![ComVer](https://img.shields.io/badge/ComVer-compliant-brightgreen.svg?style=flat-square)](https://github.com/staltz/comver)
[![npm](https://img.shields.io/npm/v/zenform.svg?style=flat-square)](https://www.npmjs.com/package/zenform)
[![module formats: umd, cjs, and es](https://img.shields.io/badge/module%20formats-umd%2c%20cjs%2c%20es-green.svg?style=flat-square)](https://unpkg.com/zenform/dist/)
[![size](http://img.badgesize.io/https://unpkg.com/zenform/dist/umd/index.min.js?label=size&style=flat-square)](https://unpkg.com/zenform/dist/)
[![gzip size](http://img.badgesize.io/https://unpkg.com/zenform/dist/umd/index.min.js?compression=gzip&label=gzip%20size&style=flat-square)](https://unpkg.com/zenform/dist/)

<!-- toc -->

* [Installation](#installation)
* [Api](#api)
  * [Form](#form)
    * [Form Props](#form-props)
    * [Form Render Props](#form-render-props)
  * [Field](#field)
    * [Field Props](#field-props)
    * [Field Render Prop](#field-render-prop)
  * [Field Array](#field-array)
    * [Field Array Props](#field-array-props)
    * [Field Array Render Prop](#field-array-render-prop)
  * [Field Observer](#field-observer)
    * [Field Observer Props](#field-observer-props)
  * [Form Observer](#form-observer)
    * [Form Observer Props](#form-observer-props)
* [Acknowledgment](#acknowledgment)
* [License](#license)

<!-- tocstop -->

## Installation

* npm

  ```sh
    npm i -S zenform
  ```

* yarn
  ```sh
    yarn add zenform
  ```

## Api

zenform has 2 core components

* [Form](#form)
* [Field](#field)

and a few helper components

* [FieldArray](#field-array)
* [FieldObserver](#field-observer)
* [FormObserver](#form-observer)

### Form

Form is top most component, all other components should be its child.

#### Form Props

* `onSubmit: (value: Object) => void`
* `initialValues?: Object`
* `validations?: (values: Object) => void | Object | Promise<*>`
* `validateOnChange?: boolean`
* `validateOnBlur?: boolean`

To render the form , it takes either a function as **render** prop or **child as a function**.  
This function will have form render props as arguments.

#### Form Render Props

* `values: Object`
* `handleSubmit: () => void`
* `resetForm: () => void`
* `errors: Object`
* `touched: Object`
* `data: Object`
* `activeField: string`
* `isDirty: boolean`
* `isInvalid: boolean`
* `initialValues: Object`
* `setFieldValue: (field: string, value: any) => void`
* `setMultipleFieldValues: (fieldValues: Array<{field: string, value: any}>) => void`
* `setFieldError: (field: string, error: any) => void`
* `setMultipleFieldErrors: (fieldErrors: Array<{field: string, error: any}>) => void`
* `setFieldTouched: (field: string, isTouched: boolean) => void`
* `setMultipleFieldTouched: (fieldTouched: Array<{field: string, isTouched: boolean}>) => void`
* `setFieldData: (field: string, data: any) => void`
* `setMultipleFieldData: (fieldData: Array<{field: string, data: any}>) => void`
* `setActiveField: (field: string) => void`

---

### Field

Field is the actual input component, it should always be a child of Form component.

#### Field Props

* `name: string`
* `format?: (value: any) => any`
* `parse?: (value: any) => any`
* `allowNull?: boolean`
* `value?: any`

To render the field , it takes either a component (string or react component) or a function as **render** prop or **child as a function**.  
This function will have field render props as arguments.

#### Field Render Prop

* `input: Object`

  * `name: string`
  * `value: any`
  * `onChange: (Event<*>) => void`
  * `onBlur: (Event<*>) => void`
  * `onFocus: (Event<*>) => void`

* `meta: Object`
  * `error: any`
  * `data: any`
  * `isActive: boolean`
  * `isTouched: boolean`

---

### Field Array

Array Field is a helper component for using multiple array input.

#### Field Array Props

* `name: string`

To render the field array, it takes either a function as **render** prop or **child as a function**.  
This function will have field array render props as arguments.

#### Field Array Render Prop

* `fields: Object`
  * `name: string,`
  * `arrayValues: any[]`
  * `forEach: (iterator: (name: string, index: number) => void) => void`
  * `insert: (index: number, value: any) => void`
  * `map: (iterator: (name: string, index: number) => any) => any[]`
  * `move: (from: number, to: number) => void`
  * `pop: () => void`
  * `push: (value: any) => void`
  * `remove: (index: number) => void`
  * `replace: (index: number, value: any) => void`
  * `swap: (indexA: number, indexB: number) => void`
  * `unshift: (value: any) => number`

---

### Field Observer

A FieldObserver component observes a given field and provides functions to access `onChange`, `onBlur` and `onFocus` on it.  
This component doesn't render anything on the dom.

#### Field Observer Props

* `name: string`
* `onChange?: (fieldObserverData: FieldObserverData) => void`
* `onBlur?: (fieldObserverData: FieldObserverData) => void`
* `onFocus?: (fieldObserverData: FieldObserverData) => void`

where `FieldObserverData` is an object containing

* `name: string`
* `value: any`
* `formValues: Object`
* `data: any`
* `isActive: any`
* `isTouched: boolean`
* `setFieldValue: (field: string, value: any) => void`
* `setMultipleFieldValues: (fieldValues: Array<{field: string, value: any}>) => void`
* `setFieldError: (field: string, error: any) => void`
* `setMultipleFieldErrors: (fieldErrors: Array<{field: string, error: any}>) => void`
* `setFieldTouched: (field: string, isTouched: boolean) => void`
* `setMultipleFieldTouched: (fieldTouched: Array<{field: string, isTouched: boolean}>) => void`
* `setFieldData: (field: string, data: any) => void`
* `setMultipleFieldData: (fieldData: Array<{field: string, data: any}>) => void`
* `setActiveField: (field: string) => void`

---

### Form Observer

A FormObserver component observes values of the whole form and provides functions to access `onChange` on it.  
This component doesn't render anything on the dom.

#### Form Observer Props

* `onChange?: (formObserverData: FormObserverData) => void`

where `FormObserverData` is an object containing

* `values: Object`
* `setFieldValue: (field: string, value: any) => void`
* `setMultipleFieldValues: (fieldValues: Array<{field: string, value: any}>) => void`
* `setFieldError: (field: string, error: any) => void`
* `setMultipleFieldErrors: (fieldErrors: Array<{field: string, error: any}>) => void`
* `setFieldTouched: (field: string, isTouched: boolean) => void`
* `setMultipleFieldTouched: (fieldTouched: Array<{field: string, isTouched: boolean}>) => void`
* `setFieldData: (field: string, data: any) => void`
* `setMultipleFieldData: (fieldData: Array<{field: string, data: any}>) => void`
* `setActiveField: (field: string) => void`

## Acknowledgment

* [react-final-form](https://github.com/final-form/react-final-form)

  * Api design
  * Lots of code pieces

* [formik](https://github.com/jaredpalmer/formik)
  * Lots of code pieces

## License

MIT
