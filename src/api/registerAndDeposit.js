const FP = require('lodash/fp')
const post = require('../lib/dvf/post-authenticated')
const DVFError = require('../lib/dvf/DVFError')
const { Joi, fromQuantizedToBaseUnitsBN } = require('dvf-utils')

const contractRegisterAndDepositFromStarkTx = require('./contract/registerAndDepositFromStarkTx')
const getVaultId = require('./getVaultId')
const validateWithJoi = require('../lib/validators/validateWithJoi')
const getSafeQuantizedAmountOrThrow = require('../lib/dvf/token/getSafeQuantizedAmountOrThrow')

const schema = Joi.object({
  token: Joi.string(),
  amount: Joi.bigNumber().greaterThan(0).required() // number or number string
})

const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'depositV2'
})

module.exports = async (dvf, depositData, starkPublicKey, nonce, signature, contractWalletAddress, encryptedTradingKey) => {

  const starkKey = starkPublicKey.x

  const registrationData = {
    starkKey,
    nonce,
    signature,
    ...(encryptedTradingKey && {encryptedTradingKey}),
    ...(contractWalletAddress && {contractWalletAddress})
  }

  const userRegistered = await post(dvf, '/v1/trading/w/register', nonce, signature, registrationData)

  if (userRegistered.isRegistered) {
    return userRegistered
  }

  if (userRegistered.deFiSignature) {
    const { token, amount } = validateArg0(depositData)

    const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
    const quantisedAmount = getSafeQuantizedAmountOrThrow(amount, tokenInfo)
    const vaultId = await getVaultId(dvf, token, nonce, signature)

    await dvf.contract.approve(
      token,
      fromQuantizedToBaseUnitsBN(tokenInfo, quantisedAmount).toString(),
      dvf.config.DVF.registrationAndDepositInterfaceAddress
    )

    // Sending the deposit transaction to the blockchain first before notifying the server
    const tx = {
      vaultId,
      tokenId: tokenInfo.starkTokenId,
      starkKey: '0x' + starkKey,
      amount: quantisedAmount,
      tokenAddress: tokenInfo.tokenAddress,
      quantum: tokenInfo.quantization
    }

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
    // Don't await for the tx, resolve on tx hash and the integration will take care of the rest
    const onChainRegisterDeposit = contractRegisterAndDepositFromStarkTx(dvf, userRegistered.deFiSignature, tx, {transactionHashCb})

    const transactionHash = await transactionHashPromise

    const payload = {
      token,
      amount: quantisedAmount,
      txHash: transactionHash
    }
    // Force the use of header (instead of payload) for authentication.
    dvf = FP.set('config.useAuthHeader', true, dvf)
    const httpDeposit = await post(dvf, '/v1/trading/deposits', nonce, signature, payload)

    return { ...httpDeposit, transactionHash, onChainRegisterDeposit }
  }
}
