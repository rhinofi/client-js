const FP = require('lodash/fp')
const { Joi } = require('dvf-utils')
const post = require('../lib/dvf/post-authenticated')

const validateWithJoi = require('../lib/validators/validateWithJoi')
const makeCreateSignedTransferTx = require('../lib/dvf/makeCreateSignedTransferTx')
const generateRandomNonceV2 = require('../lib/dvf/generateRandomNonceV2')

const schema = Joi.object({
  token: Joi.string(),
  amount: Joi.bigNumber().greaterThan(0),
  feeAmount: Joi.bigNumber().default(0).optional(),
  recipientEthAddress: Joi.string(),
  nonce: Joi.number().integer().optional()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'transferAndWithdraw'
})

module.exports = async (dvf, data, authNonce, signature, createSignedTransferTx = makeCreateSignedTransferTx(dvf)) => {
  dvf = FP.set('config.useAuthHeader', true, dvf)
  const { token, amount, feeAmount, recipientEthAddress, nonce } = validateInputs(data)

  const transferData = {
    token,
    amount,
    feeAmount,
    recipientVaultId: 0, // We will always use vaultId 0
    recipientPublicKey: recipientEthAddress
  }

  const endpoint = '/v1/trading/w/transferAndWithdraw'

  const payload = await dvf.createTransferAndWithdrawPayload(transferData, createSignedTransferTx)

  return post(dvf, endpoint, authNonce, signature, { ...payload, nonce: nonce || generateRandomNonceV2() })
}
