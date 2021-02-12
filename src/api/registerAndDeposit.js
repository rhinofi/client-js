const post = require('../lib/dvf/post-authenticated')
const DVFError = require('../lib/dvf/DVFError')

const { fromQuantizedToBaseUnitsBN } = require('dvf-utils')

const postDeposit = require('../lib/dvf/makeDepositOrWithdrawV2ApiMethod')('deposit')
const contractRegisterAndDepositFromStarkTx = require('./contract/registerAndDepositFromStarkTx')

module.exports = async (dvf, depositData, starkPublicKey, nonce, signature, contractWalletAddress, encryptedTradingKey) => {

  const tradingKey = starkPublicKey.x

  const endpoint = '/v1/trading/w/register'

  const registrationData = {
    starkKey: tradingKey,
    nonce,
    signature,
    ...(encryptedTradingKey && {encryptedTradingKey}),
    ...(contractWalletAddress && {contractWalletAddress})
  }

  const userRegistered = await post(dvf, endpoint, nonce, signature, registrationData)

  if (userRegistered.isRegistered) {
    return userRegistered
  }

  if (userRegistered.deFiSignature) {
    const httpDeposit = await postDeposit(dvf, depositData, nonce, signature)

    const { token, tx } = httpDeposit

    const tokenInfo = dvf.token.getTokenInfoOrThrow(token)

    await dvf.contract.approve(
      token,
      fromQuantizedToBaseUnitsBN(tokenInfo, tx.amount).toString(),
      '0xeccac43fc2f30b4765335278294d1eec6c3c2174'
    )

    const onChainRegisterDeposit = await contractRegisterAndDepositFromStarkTx(dvf, userRegistered.deFiSignature, tx)

    if (!onChainRegisterDeposit.status) {
      throw new DVFError('ERR_ONCHAIN_REGISTER_DEPOSIT', {
        httpDeposit,
        onChainRegisterDeposit
      })
    }

    return { ...httpDeposit, transactionHash: onChainRegisterDeposit.transactionHash }
  }
}
