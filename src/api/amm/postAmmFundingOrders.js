const R = require('ramda')

const post = require('../../lib/dvf/post-authenticated')
const validateWithJoi = require('../../lib/validators/validateWithJoi')
const { fundOrderDataSchema } = require('./schemas')

const validateData = validateWithJoi(fundOrderDataSchema)('INVALID_METHOD_ARGUMENT')({
  context: 'postAmmFundingOrder'
})

const endpoint = '/v1/trading/amm/fundingOrders'

module.exports = async (dvf, data, nonce, signature) => post(
  dvf, endpoint, nonce, signature, await R.compose(
    // Only sign if there is no starkPublicKey (schema ensures that signatures
    // are present if starkPublicKey is provides).
    a => a.starkPublicKey ? a : dvf.stark.signAmmFundingOrder(a),
    validateData
  )(data)
)
