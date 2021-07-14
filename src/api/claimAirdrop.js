const { Joi } = require('dvf-utils')
const validateWithJoi = require('../lib/validators/validateWithJoi')
const post = require('../lib/dvf/post-authenticated')

const schema = Joi.object({
  ethAddress: Joi.ethAddress(),
  token: Joi.string()
})

const validatePayload = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'claimAirdrop'
})

const endpoint = '/v1/trading/w/claimAirdrop'

/**
 * Claim pending airdrop tokens for the given address/token
 */
module.exports = async (dvf, data = {}, nonce, signature) => {
  const payload = validatePayload(data)
  return post(dvf, endpoint, nonce, signature, payload)
}
