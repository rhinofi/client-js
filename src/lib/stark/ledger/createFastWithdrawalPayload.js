const FP = require('lodash/fp')
const {
  fromQuantizedToBaseUnitsBN,
  Joi,
  toBN,
  toQuantizedAmountBN
} = require('@rhino.fi/dvf-utils')
const BN = require('bignumber.js')
const swJs = require('@rhino.fi/starkware-crypto')
const Eth = require('@ledgerhq/hw-app-eth').default
const selectTransport = require('../../ledger/selectTransport')

const calculateFact = require('../calculateFact')
const validateWithJoi = require('../../validators/validateWithJoi')

const DVFError = require('../../dvf/DVFError')

// TODO
const calculateFee = amount => 0

const address0 = '0x'.padEnd(42, '0')

const getValidTokenInfo = dvf => token => {
  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)

  if (!tokenInfo.starkVaultId) {
    throw new DVFError(
      'NO_STARK_VAULT_ID_FOR_TOKEN',
      {token, context: 'fastWithdrawal'}
    )
  }

  if (!tokenInfo.deversifiStarkVaultId) {
    throw new DVFError(
      'NO_DEVERSIFI_STARK_VAULT_ID_FOR_TOKEN',
      {token, context: 'fastWithdrawal'}
    )
  }

  return tokenInfo
}

const getFeeQuantised = (dvf) => async (token, amount, recipient) => dvf
  .getWithdrawalQuote({
    token,
    amount,
    chain: 'ETHEREUM',
    type: 'FAST',
    recipient
  })
  .then(res => toBN(res.fee))

const schema = Joi.object({
  amount: Joi.amount(),
  // NOTE: we are not specifying allowed tokens here since these can change
  // dynamically. However a call to `getTokenInfoOrThrow` will ensure that
  // the token in valid.
  token: Joi.string(),
  // TODO: create Joi.ethAddress
  recipientEthAddress: Joi.string().optional()
})

const errorProps = {context: 'fastWithdrawal'}
const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({...errorProps, argIdx: 0})

module.exports = async (dvf, withdrawalData, path) => {
  const {
    amount,
    token,
    recipientEthAddress = dvf.config.ethAddress,
    transactionFee
  } = validateArg0(withdrawalData)
  const Transport = selectTransport(dvf.isBrowser)
  const starkPublicKey = await dvf.stark.ledger.getPublicKey(path)
  const transport = await Transport.create()
  const eth = new Eth(transport)
  const {address} = await eth.getAddress(path)
  const starkPath = dvf.stark.ledger.getPath(address)
  const tokenInfo = getValidTokenInfo(dvf)(token)
  const transferQuantization = new BN(tokenInfo.quantization)

  const quantisedAmount = toQuantizedAmountBN(tokenInfo, amount)
  const baseUnitsAmount = fromQuantizedToBaseUnitsBN(tokenInfo)(quantisedAmount)
  const feeQuantised = await (
    transactionFee
      ? toQuantizedAmountBN(tokenInfo, transactionFee)
      : getFeeQuantised(dvf)(token, quantisedAmount.toString(), recipientEthAddress)
  )

  const tokenContractAddress = token === 'ETH'
    ? address0
    : tokenInfo.tokenAddressPerChain.ETHEREUM

  const nonce = dvf.util.generateRandomNonce()

  // On chain transfer will be for the amount without fee
  const fact = calculateFact(
    recipientEthAddress, baseUnitsAmount.toString(), tokenContractAddress, nonce
  )

  // This should be in hours
  const expirationTimestamp =
    Math.ceil(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  const {DVF} = dvf.config
  const tx = {
    // Stark transaction includes the fee.
    amount: quantisedAmount.plus(feeQuantised).toString(),
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

  try {
    await dvf.token.provideContractData(eth, token === 'ETH' ? '' : tokenContractAddress, transferQuantization)
    const starkSignature = await eth.starkSignTransfer_v2(
      starkPath,
      tokenContractAddress,
      token === 'ETH' ? 'eth' : 'erc20',
      transferQuantization,
      null,
      DVF.deversifiStarkKeyHex,
      tokenInfo.starkVaultId,
      tokenInfo.deversifiStarkVaultId,
      quantisedAmount.plus(feeQuantised),
      nonce,
      expirationTimestamp,
      DVF.starkExTransferRegistryContractAddress,
      fact
    )
    return {
      recipientEthAddress,
      transactionFee: feeQuantised.toString(),
      tx: {
        ...tx,
        signature: {
          r: `0x${starkSignature.r}`,
          s: `0x${starkSignature.s}`
        }
      },
      starkPublicKey
    }
  } finally {
    await transport.close()
  }
}
