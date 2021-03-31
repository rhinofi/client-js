const DVFError = require('../dvf/DVFError')

const defaultOptions = Object.freeze({
  allowUnknown: true,
  stripUnknown: true,
  presence: 'required'
})

module.exports = (schema, options = defaultOptions) => errorType => errorProps => value => {
  const { value: validated, error } = schema.validate(value, options)
  if (error) {
    throw new DVFError(
      errorType,
      { ...errorProps, reason: error.message, details: error.details }
    )
  }
  return validated
}