const getHasFormError = (formProps) => (field) => {
  const {errors, touched} = formProps
  return formProps.submitCount > 0 && Boolean(errors[field] && touched[field])
}

export const CommonFormPropsFactory = (formProps, extraFields) => {
  const getHasError = getHasFormError(formProps)
  const {values, handleChange, handleBlur, errors} = formProps
  return (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    required: true,
    variant: 'outlined',
    error: getHasError(name),
    helperText: getHasError(name) && errors[name],
    ...extraFields,
  })
}

// focus on error
// Formik has not direct support for that, but one can implement it manually
// see e.g. https://gist.github.com/dphrag/4db3b453e02567a0bb52592679554a5b
