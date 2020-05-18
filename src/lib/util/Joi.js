const { preparePrice, prepareAmount } = require('bfx-api-node-util')
const toBN = require('./toBN')
const Joi = require('@hapi/joi')

module.exports = Joi
  .extend(Joi => ({
    base: Joi.string(),
    type: 'price',
    messages: {
      'price.base': '"{{#label}}" must be a valid number or numerical string',
      'price.zero': '"{{#label}}" must not be 0'
    },
    coerce: (value, helpers) => {
      try {
        return { value: preparePrice(toBN(value).toString()) }
      } catch {
        return { value }
      }
    },
    validate: (value, helpers) => {
      let parsed
      let error

      try {
        // Throws is value is not valid number or cannot be converted to one
        const bn = toBN(value)
        if (bn.isZero()) {
          return { value, errors: helpers.error('price.zero') }
        }
      } catch (error) {
        error = error
        return { value, errors: helpers.error('price.base') }
      }
    }
  }))
  .extend(Joi => ({
    base: Joi.string(),
    type: 'amount',
    messages: {
      'amount.base': '"{{#label}}" must be a valid number or numerical string',
      'amount.zero': '"{{#label}}" must not be 0'
    },
    coerce: (value, helpers) => {
      try {
        return { value: prepareAmount(toBN(value).toString()) }
      } catch {
        return { value }
      }
    },
    validate: (value, helpers) => {
      let parsed
      let error

      try {
        // Throws is value is not valid number or cannot be converted to one
        const bn = toBN(value)
        if (bn.isZero()) {
          return { value, errors: helpers.error('amount.zero') }
        }
      } catch (error) {
        error = error
        return { value, errors: helpers.error('amount.base') }
      }
    }
  }))

