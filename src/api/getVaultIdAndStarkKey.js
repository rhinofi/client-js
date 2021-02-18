const { Joi } = require('dvf-utils')

const get = require('../lib/dvf/get-authenticated')
const validateWithJoi = require('../lib/validators/validateWithJoi')

const schema = Joi.object({
  token: Joi.string(),
  targetEthAddress: Joi.ethAddress()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: `getVaultIdAndStarkKey`
})

module.exports = async (dvf, data, nonce, signature) => {
  const { token, targetEthAddress } = validateInputs(data)

  const endpoint = '/v1/trading/r/vaultIdAndStarkKey'

  return get(dvf, endpoint, nonce, signature, { token, targetEthAddress })
}
