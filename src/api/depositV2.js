const FP = require('lodash/fp')
const { Joi, fromQuantizedToBaseUnitsBN } = require('dvf-utils')

const post = require('../lib/dvf/post-authenticated')

const contractDepositFromStarkTx = require('./contract/depositFromStarkTx')
const getVaultId = require('./getVaultId')
const validateWithJoi = require('../lib/validators/validateWithJoi')
const DVFError = require('../lib/dvf/DVFError')
const getSafeQuantizedAmountOrThrow = require('../lib/dvf/token/getSafeQuantizedAmountOrThrow')

const schema = Joi.object({
  token: Joi.string(),
  amount: Joi.bigNumber().greaterThan(0).required() // number or number string
})

const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'depositV2'
})

const endpoint = '/v1/trading/deposits'

module.exports = async (dvf, data, nonce, signature) => {
  const { token, amount } = validateArg0(data)

  const starkKey = dvf.config.starkKeyHex

  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
  const quantisedAmount = getSafeQuantizedAmountOrThrow(amount, tokenInfo)
  const vaultId = await getVaultId(dvf, token, nonce, signature)

  await dvf.contract.approve(
    token,
    fromQuantizedToBaseUnitsBN(tokenInfo, quantisedAmount).toString()
  )

  // Sending the deposit transaction to the blockchain first before notifying the server
  const tx = {
    vaultId,
    tokenId: tokenInfo.starkTokenId,
    starkKey,
    amount: quantisedAmount
  }

  // As we need the txHash ASAP (before the tx is mined),
  // we need to use the 'transactionHash' of the underlyind 'send' method
  // PromEvents make it difficult to listen to events when the PromEvent
  // is nested in other Promises. This workaround allows to listen to the
  // event without changing the return signatures of the underlying 'send'
  // More : https://github.com/ChainSafe/web3.js/issues/1547
  let transactionHashCb
  const transactionHashPromise = new Promise(resolve => {
    transactionHashCb = resolve
  })

  const onChainDepositPromise = contractDepositFromStarkTx(dvf, tx, {transactionHashCb})

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
