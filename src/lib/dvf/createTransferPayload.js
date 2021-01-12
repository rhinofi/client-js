// TODO: remove code dup between this and createFastWithdrawalPayload
const FP = require('lodash/fp')
const {
  Joi,
  starkTransferTxToMessageHash,
  toQuantizedAmountBN
} = require('dvf-utils')
const swJs = require('starkware_crypto')

const validateWithJoi = require('../validators/validateWithJoi')

const DVFError = require('./DVFError')

const getValidTokenInfo = dvf => token => {
  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)

  if (!tokenInfo.starkVaultId) {
    throw new DVFError(
      'NO_STARK_VAULT_ID_FOR_TOKEN',
      { token, context: 'createTransferPayload' }
    )
  }

  return tokenInfo
}

// TODO: move to dvf-utils
const prefixedHexString = Joi.string()
  .pattern(/^0x[a-f0-9]+$/i)
  .message('"value" must be composed of hexadecimal characters prefixed with: "0x"')
  .description('hexadecimal string prefixed with: "0x"')

const schema = Joi.object({
  amount: Joi.amount(),
  // NOTE: we are not specifying allowed tokens here since these can change
  // dynamically. However a call to `getTokenInfoOrThrow` will ensure that
  // the token in valid.
  token: Joi.string(),
  recipientPublicKey: prefixedHexString,
  recipientValuntId: Joi.number().integer()
  // TODO: provide a way of converting recipientEthAddress into above 2 props.
  // This would require making both recipientPublicKey and recipientValuntId
  // publicly available (or at least available to users who have been granted
  // access by the owner of recipientEthAddress).
  // recipientEthAddress: Joi.ethAddress()
})

const errorProps = { context: 'transfer' }
const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  ...errorProps, argIdx: 0
})

module.exports = async (dvf, transferData, starkPrivateKey) => {
  // Not asserting a specific type since it could be either a string or BigInt
  // depending on the used sw crypto implementation.
  if (!starkPrivateKey) {
    throw new DVFError(
      'STARK_PRIVATE_KEY_IS_REQUIRED', { ...errorProps, argIdx: 1 }
    )
  }

  const {
    amount,
    token,
    recipientPublicKey,
    recipientValuntId
  } = validateArg0(transferData)

  const tokenInfo = getValidTokenInfo(dvf)(token)

  const { starkPublicKey, starkKeyPair } = await dvf.stark.createKeyPair(starkPrivateKey)

  // This should be in hours
  const expirationTimestamp =
    Math.ceil(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  const quantisedAmount = toQuantizedAmountBN(tokenInfo, amount)

  const nonce = dvf.util.generateRandomNonce()

  const tx = {
    amount: quantisedAmount.toString(),
    expirationTimestamp,
    nonce,
    receiverPublicKey: recipientPublicKey,
    receiverVaultId: recipientValuntId,
    senderPublicKey: `0x${starkPublicKey.x}`,
    senderVaultId: tokenInfo.starkVaultId,
    token: tokenInfo.starkTokenId,
    type: 'TransferRequest'
  }

  const starkMessage = starkTransferTxToMessageHash(dvf.sw || swJs)(tx)

  const signature = FP.mapValues(
    // Prepend 0x to each prop on the signature.
    x => '0x' + x,
    dvf.stark.sign(starkKeyPair, starkMessage)
  )

  return {
    tx: { ...tx, signature },
    starkPublicKey
  }
}
