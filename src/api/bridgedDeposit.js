const FP = require('lodash/fp')
const { Joi, fromQuantizedToBaseUnitsBN } = require('dvf-utils')

const post = require('../lib/dvf/post-authenticated')

const validateWithJoi = require('../lib/validators/validateWithJoi')
const DVFError = require('../lib/dvf/DVFError')
const getSafeQuantizedAmountOrThrow = require('../lib/dvf/token/getSafeQuantizedAmountOrThrow')
const getTokenAddressFromTokenInfoOrThrow = require('../lib/dvf/token/getTokenAddressFromTokenInfoOrThrow')
const permitParamsSchema = require('../lib/schemas/permitParamsSchema')
const depositFromSidechainBridge = require('./contract/depositFromSidechainBridge')
const createPromiseAndCallbackFn = require('../lib/util/createPromiseAndCallbackFn')

const schema = Joi.object({
  chain: Joi.string(),
  token: Joi.string(),
  amount: Joi.bigNumber().greaterThan(0), // number or number string
  // useProxiedContract: Joi.boolean().optional().default(false),
  permitParams: permitParamsSchema.optional(),
  web3Options: Joi.object().optional() // For internal use (custom gas limits, etc)
})

const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'bridgedDeposit'
})

const endpoint = '/v1/trading/bridgedDeposits'

module.exports = async (dvf, data, nonce, signature, txHashCb) => {
  const { chain, token, amount, web3Options, permitParams } = validateArg0(data)

  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
  const quantisedAmount = getSafeQuantizedAmountOrThrow(amount, tokenInfo)
  const baseUnitAmount = fromQuantizedToBaseUnitsBN(tokenInfo, quantisedAmount).toString()

  const bridgeContractAddress = dvf.getBridgeContractAddressOrThrow(chain)

  if (!permitParams) {
    await dvf.contract.approve(
      token,
      baseUnitAmount,
      bridgeContractAddress,
      chain
    )
  }

  const tokenAddress = getTokenAddressFromTokenInfoOrThrow(tokenInfo, chain)

  // Sending the deposit transaction to the blockchain first before notifying the server
  const tx = {
    bridgeContractAddress,
    tokenAddress,
    baseUnitAmount
  }
  const [transactionHashPromise, transactionHashCb] = createPromiseAndCallbackFn(txHashCb)

  if (dvf.dvfStarkProvider && dvf.dvfStarkProvider.getWalletType() === 'LEDGER') {
    await dvf.token.provideContractData(null, tx.tokenAddress, tx.quantum)
  }

  const options = {
    transactionHashCb,
    ...web3Options
  }

  const onChainDepositPromise = depositFromSidechainBridge(dvf, tx, options)

  const transactionHash = await transactionHashPromise

  const payload = {
    chain,
    token,
    amount: quantisedAmount,
    txHash: transactionHash
  }
  // Force the use of header (instead of payload) for authentication.
  dvf = FP.set('config.useAuthHeader', true, dvf)
  const httpDeposit = await post(dvf, endpoint, nonce, signature, payload)

  const onChainDeposit = await onChainDepositPromise

  if (!onChainDeposit.status) {
    throw new DVFError('ERR_ONCHAIN_BRIDGED_DEPOSIT', {
      httpDeposit,
      onChainDeposit
    })
  }

  return { ...httpDeposit, transactionHash }
}
