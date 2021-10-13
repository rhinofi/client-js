const { Joi } = require('dvf-utils')

const validateWithJoi = require('../lib/validators/validateWithJoi')
const { post } = require('request-promise')

const schema = Joi.object({
  walletType: Joi.string(),
  errorText: Joi.string()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: `walletFailedEvent`
})

module.exports = async (dvf, data) => {
    const { walletType, errorText } = validateInputs(data)

  const uri = `${dvf.config.api}/v1/trading/w/walletFailedEvent`

  return await post({
      uri,
      json: { walletType, errorText }
  })
}
