const FP = require('lodash/fp')
const { Joi } = require('dvf-utils')
const { post } = require('request-promise')

const validateWithJoi = require('../lib/validators/validateWithJoi')
const makeCreateSignedTransferTx = require('../lib/dvf/makeCreateSignedTransferTx')

const schema = Joi.object({
  token: Joi.string(),
  amount: Joi.bigNumber().greaterThan(0),
  recipientEthAddress: Joi.ethAddress()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: `transferAndWithdraw`
})

module.exports = async (dvf, data, nonce, signature, createSignedTransferTx = makeCreateSignedTransferTx(dvf)) => {
  dvf = FP.set('config.useAuthHeader', true, dvf)
  const { token, amount, recipientEthAddress } = validateInputs(data)
  const { vaultId, starkKey } = await dvf.getVaultIdAndStarkKey({
    token,
    targetEthAddress: recipientEthAddress
  }, nonce, signature)

  const transferData = {
    token,
    amount,
    recipientVaultId: vaultId,
    recipientPublicKey: starkKey
  }

  const url = dvf.config.api + '/v2/trading/w/transferAndWithdraw'

  const json = await dvf.createTransferAndWithdrawPayload(transferData, createSignedTransferTx)

  return post(url, { json })
}
