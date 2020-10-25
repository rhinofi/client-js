const FP = require('lodash/fp')
const {
  fromQuantizedToBaseUnitsBN,
  Joi,
  starkTransferTxToMessageHash,
  toQuantizedAmountBN
} = require('dvf-utils')
const swJs = require('starkware_crypto')

const calculateFact = require('../stark/calculateFact')
const validateWithJoi = require('../validators/validateWithJoi')

const DVFError = require('./DVFError')

// TODO
const calculateFee = amount => 0

const address0 = '0x'.padEnd(42, '0')

const getValidTokenInfo = dvf => token => {
  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)

  if (!tokenInfo.starkVaultId) {
    throw new DVFError(
      'NO_STARK_VAULT_ID_FOR_TOKEN',
      { token, context: 'fastWithdrawal' }
    )
  }

  if (!tokenInfo.deversifiStarkVaultId) {
    throw new DVFError(
      'NO_DEVERSIFI_STARK_VAULT_ID_FOR_TOKEN',
      { token, context: 'fastWithdrawal' }
    )
  }

  return tokenInfo
}

const schema = Joi.object({
  amount: Joi.amount().required(),
  // NOTE: we are not specifying allowed tokens here since these can change
  // dynamically. However a call to `getTokenInfoOrThrow` will ensure that
  // the token in valid.
  token: Joi.string().required(),
  // TODO: create Joi.ethAddress
  recipientEthAddress: Joi.string().optional()
})

const errorProps = { context: 'fastWithdrawal' }
const validateArg0 = validateWithJoi
  (schema)
  ('INVALID_METHOD_ARGUMENT')
  ({ ...errorProps, argIdx: 0 })

module.exports = async (dvf, withdrawalData, starkPrivateKey) => {
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
    recipientEthAddress = dvf.config.ethAddress
  } = validateArg0(withdrawalData)

  const tokenInfo = getValidTokenInfo(dvf)(token)

  const { starkPublicKey, starkKeyPair } = await dvf.stark.createKeyPair(
    starkPrivateKey
  )

  const transactionFee = toQuantizedAmountBN(tokenInfo, calculateFee(amount))

  // This should be in hours
  const expirationTimestamp =
    Math.ceil(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  const tokenContractAddress = token === 'ETH'
    ? address0
    : tokenInfo.tokenAddress
  const quantisedAmount = toQuantizedAmountBN(tokenInfo, amount)
  const baseUnitsAmount = fromQuantizedToBaseUnitsBN(tokenInfo)(quantisedAmount)

  const nonce = dvf.util.generateRandomNonce()
  // On chain transfer will be for the amount without fee
  const fact = calculateFact(
    recipientEthAddress, baseUnitsAmount.toString(), tokenContractAddress, nonce
  )

  const { DVF } = dvf.config
  const tx = {
    // Stark transaction includes the fee.
    amount: quantisedAmount.plus(transactionFee).toString(),
    expirationTimestamp,
    fact,
    factRegistryAddress: DVF.starkExTransferRegistryContractAddress,
    nonce,
    receiverPublicKey: DVF.deversifiStarkKeyHex,
    receiverVaultId: tokenInfo.deversifiStarkVaultId,
    senderPublicKey: `0x${starkPublicKey.x}`,
    senderVaultId: tokenInfo.starkVaultId,
    token: tokenInfo.starkTokenId,
    type: 'ConditionalTransferRequest'
  }

  const starkMessage = starkTransferTxToMessageHash(dvf.sw || swJs)(tx)

  const signature = FP.mapValues(
    // Prepend 0x to each prop on the signature.
    x => '0x' + x,
    dvf.stark.sign(starkKeyPair, starkMessage)
  )

  return {
    recipientEthAddress,
    transactionFee,
    tx: { ...tx, signature },
    starkPublicKey
  }
}
