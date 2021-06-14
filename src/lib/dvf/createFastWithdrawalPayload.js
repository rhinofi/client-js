const {
  fromQuantizedToBaseUnitsBN,
  Joi,
  toBN,
  toQuantizedAmountBN
} = require('dvf-utils')

const calculateFact = require('../stark/calculateFact')
const validateWithJoi = require('../validators/validateWithJoi')

const DVFError = require('./DVFError')

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

const getFeeQuantised = async (dvf, token) => dvf
  .fastWithdrawalFee(token)
  .then(res => toBN(res.feeQuantised))

const schema = Joi.object({
  amount: Joi.amount(),
  // NOTE: we are not specifying allowed tokens here since these can change
  // dynamically. However a call to `getTokenInfoOrThrow` will ensure that
  // the token in valid.
  token: Joi.string(),
  // TODO: create Joi.ethAddress
  recipientEthAddress: Joi.string().optional(),
  transactionFee: Joi.alternatives()
    .try(Joi.string(), Joi.number())
    .optional()
})

const errorProps = { context: 'fastWithdrawal' }
const validateArg0 = validateWithJoi(schema)
  ('INVALID_METHOD_ARGUMENT')
  ({ ...errorProps, argIdx: 0 })

module.exports = async (dvf, withdrawalData) => {
  const {
    amount,
    token,
    recipientEthAddress = dvf.config.ethAddress,
    transactionFee
  } = validateArg0(withdrawalData)

  const tokenInfo = getValidTokenInfo(dvf)(token)

  const feeQuantised = await (
    transactionFee
      ? toQuantizedAmountBN(tokenInfo, transactionFee)
      : getFeeQuantised(dvf, token)
  )

  const tokenContractAddress = token === 'ETH'
    ? address0
    : tokenInfo.tokenAddressPerChain.ETHEREUM
  const quantisedAmount = toQuantizedAmountBN(tokenInfo, amount)
  const baseUnitsAmount = fromQuantizedToBaseUnitsBN(tokenInfo)(quantisedAmount)

  const nonce = dvf.util.generateRandomNonce()

  // On chain transfer will be for the amount without fee
  const fact = calculateFact(
    recipientEthAddress, baseUnitsAmount.toString(), tokenContractAddress, nonce
  )

  const { DVF } = dvf.config
  const txParams = {
    // Stark transaction includes the fee.
    amount: quantisedAmount.plus(feeQuantised).toString(),
    fact,
    factRegistryAddress: DVF.starkExTransferRegistryContractAddress,
    nonce,
    receiverPublicKey: DVF.deversifiStarkKeyHex,
    receiverVaultId: tokenInfo.deversifiStarkVaultId,
    senderVaultId: tokenInfo.starkVaultId,
    token: tokenInfo.starkTokenId,
    type: 'ConditionalTransferRequest'
  }

  const tx = await dvf.createSignedTransfer(txParams)

  // TODO: Refactor to avoid getting pub key at different levels
  const { dvfStarkProvider } = dvf
  const starkPublicKey = await dvfStarkProvider.getPublicKey()

  return {
    recipientEthAddress,
    transactionFee: feeQuantised.toString(),
    tx,
    starkPublicKey
  }
}
