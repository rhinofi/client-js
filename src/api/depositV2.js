const FP = require('lodash/fp')
const { Joi, fromQuantizedToBaseUnitsBN } = require('dvf-utils')

const post = require('../lib/dvf/post-authenticated')

const contractDepositFromStarkTx = require('./contract/depositFromStarkTx')
const contractDepositFromProxiedStarkTx = require('./contract/depositFromProxiedStarkTx')
const getVaultId = require('./getVaultId')
const validateWithJoi = require('../lib/validators/validateWithJoi')
const DVFError = require('../lib/dvf/DVFError')
const getSafeQuantizedAmountOrThrow = require('../lib/dvf/token/getSafeQuantizedAmountOrThrow')
const getTokenAddressFromTokenInfoOrThrow = require('../lib/dvf/token/getTokenAddressFromTokenInfoOrThrow')

const schema = Joi.object({
  token: Joi.string(),
  amount: Joi.bigNumber().greaterThan(0), // number or number string
  useProxiedContract: Joi.boolean().optional().default(false),
  web3Options: Joi.object().optional() // For internal use (custom gas limits, etc)
})

const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'depositV2'
})

const endpoint = '/v1/trading/deposits'

module.exports = async (dvf, data, nonce, signature) => {
  const { token, amount, useProxiedContract, web3Options } = validateArg0(data)

  const starkKey = dvf.config.starkKeyHex

  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
  const quantisedAmount = getSafeQuantizedAmountOrThrow(amount, tokenInfo)
  const vaultId = await getVaultId(dvf, token, nonce, signature)

  await dvf.contract.approve(
    token,
    fromQuantizedToBaseUnitsBN(tokenInfo, quantisedAmount).toString(),
    useProxiedContract
      ? dvf.config.DVF.registrationAndDepositInterfaceAddress
      : dvf.config.DVF.starkExContractAddress,
    'ETHEREUM'
  )

  const tokenAddress = getTokenAddressFromTokenInfoOrThrow(tokenInfo, 'ETHEREUM')

  // Sending the deposit transaction to the blockchain first before notifying the server
  const tx = {
    vaultId,
    tokenId: tokenInfo.starkTokenId,
    starkKey,
    amount: quantisedAmount,
    tokenAddress,
    quantum: tokenInfo.quantization
  }

  // As we need the txHash ASAP (before the tx is mined),
  // we need to use the 'transactionHash' of the underlyind 'send' method
  // PromEvents make it difficult to listen to events when the PromEvent
  // is nested in other Promises. This workaround allows to listen to the
  // event without changing the return signatures of the underlying 'send'
  // More : https://github.com/ChainSafe/web3.js/issues/1547
  let transactionHashCb
  const transactionHashPromise = new Promise((resolve, reject) => {
    transactionHashCb = (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    }
  })

  if (dvf.dvfStarkProvider && dvf.dvfStarkProvider.getWalletType() === 'LEDGER') {
    await dvf.token.provideContractData(null, tx.tokenAddress, tx.quantum)
  }

  const options = {
    transactionHashCb,
    ...web3Options
  }

  const onChainDepositPromise = useProxiedContract
    ? contractDepositFromProxiedStarkTx(dvf, tx, options)
    : contractDepositFromStarkTx(dvf, tx, options)

  const transactionHash = await transactionHashPromise

  const payload = {
    token,
    amount: quantisedAmount,
    txHash: transactionHash
  }
  // Force the use of header (instead of payload) for authentication.
  dvf = FP.set('config.useAuthHeader', true, dvf)
  const httpDeposit = await post(dvf, endpoint, nonce, signature, payload)

  const onChainDeposit = await onChainDepositPromise

  if (!onChainDeposit.status) {
    throw new DVFError('ERR_ONCHAIN_DEPOSIT', {
      httpDeposit,
      onChainDeposit
    })
  }

  return { ...httpDeposit, transactionHash }
}
