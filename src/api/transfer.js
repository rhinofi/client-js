const FP = require('lodash/fp')
const { Joi } = require('dvf-utils')

const validateWithJoi = require('../lib/validators/validateWithJoi')

const schema = Joi.object({
  token: Joi.string(),
  amount: Joi.bigNumber().greaterThan(0),
  memo: Joi.string().optional(),
  recipientEthAddress: Joi.ethAddress()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: `transfer`
})

module.exports = async (dvf, data, nonce, signature) => {
  dvf = FP.set('config.useAuthHeader', true, dvf)
  const { token, amount, memo, recipientEthAddress } = validateInputs(data)
  const { vaultId, starkKey } = await dvf.getVaultIdAndStarkKey({
    token,
    targetEthAddress: recipientEthAddress
  }, nonce, signature)
  const feeRecipient = await dvf.getVaultIdAndStarkKey({
    token,
    targetEthAddress: dvf.config.DVF.deversifiAddress
  }, nonce, signature)
  return dvf.transferUsingVaultIdAndStarkKey({
    token,
    amount,
    memo,
    recipientVaultId: vaultId,
    recipientPublicKey: starkKey
  }, feeRecipient)
}
