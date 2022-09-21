const FP = require('lodash/fp')
const { Joi, toBN } = require('dvf-utils')

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
  web3Options: Joi.object().optional(), // For internal use (custom gas limits, etc)
  referralId: Joi.string().optional()
})

const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'bridgedDeposit'
})

const endpoint = '/v1/trading/bridgedDeposits'
const validationEndpoint = '/v1/trading/deposits-validate'

module.exports = async (dvf, data, nonce, signature, txHashCb) => {
  const { chain, token, amount, web3Options, permitParams, referralId } = validateArg0(data)

  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
  // Quantised amount must be from base token config
  const quantisedAmount = getSafeQuantizedAmountOrThrow(amount, tokenInfo)

  // Base units should be using the execution chain
  const baseUnitAmount = toBN(amount).shiftedBy(tokenInfo.decimals).toString()

  // Force the use of header (instead of payload) for authentication.
  dvf = FP.set('config.useAuthHeader', true, dvf)
  await post(dvf, validationEndpoint, nonce, signature, { token, amount: quantisedAmount })

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

  const options = {
    transactionHashCb,
    chain,
    ...web3Options
  }

  const onChainDepositPromise = depositFromSidechainBridge(dvf, tx, options)

  const transactionHash = await transactionHashPromise

  const payload = {
    chain,
    token,
    amount: quantisedAmount,
    txHash: transactionHash,
    referralId
  }
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
