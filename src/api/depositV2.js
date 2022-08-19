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
const permitParamsSchema = require('../lib/schemas/permitParamsSchema')
const createPromiseAndCallbackFn = require('../lib/util/createPromiseAndCallbackFn')

const schema = Joi.object({
  token: Joi.string(),
  amount: Joi.bigNumber().greaterThan(0), // number or number string
  useProxiedContract: Joi.boolean().optional().default(false),
  permitParams: permitParamsSchema.optional(),
  web3Options: Joi.object().optional(), // For internal use (custom gas limits, etc)
  referralId: Joi.string().optional()
})

const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'depositV2'
})

const endpoint = '/v1/trading/deposits'
const validationEndpoint = '/v1/trading/deposits-validate'

module.exports = async (dvf, data, nonce, signature, txHashCb) => {
  const { token, amount, useProxiedContract, web3Options, permitParams, referralId } = validateArg0(data)

  const starkKey = dvf.config.starkKeyHex

  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
  const quantisedAmount = getSafeQuantizedAmountOrThrow(amount, tokenInfo)
  const vaultId = await getVaultId(dvf, token, nonce, signature)

  // Force the use of header (instead of payload) for authentication.
  dvf = FP.set('config.useAuthHeader', true, dvf)
  await post(dvf, validationEndpoint, nonce, signature, { token, amount: quantisedAmount })

  if (!permitParams) {
    await dvf.contract.approve(
      token,
      fromQuantizedToBaseUnitsBN(tokenInfo, quantisedAmount).toString(),
      useProxiedContract
        ? dvf.config.DVF.registrationAndDepositInterfaceAddress
        : dvf.config.DVF.starkExContractAddress,
      'ETHEREUM'
    )
  }

  const tokenAddress = getTokenAddressFromTokenInfoOrThrow(tokenInfo, 'ETHEREUM')

  // Sending the deposit transaction to the blockchain first before notifying the server
  const tx = {
    vaultId,
    tokenId: tokenInfo.starkTokenId,
    starkKey,
    amount: quantisedAmount,
    tokenAddress,
    quantum: tokenInfo.quantization,
    permitParams
  }

  const [transactionHashPromise, transactionHashCb] = createPromiseAndCallbackFn(txHashCb)

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
    txHash: transactionHash,  
    referralId
  }

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
