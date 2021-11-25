const { post } = require('request-promise')
const DVFError = require('../lib/dvf/DVFError')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, starkPrivateKey, nonce, signature) => {
  validateAssertions(dvf, { amount, token, starkPrivateKey })

  amount = dvf.util.prepareDepositAmount(amount, token)

  const currency = dvf.token.getTokenInfo(token)
  const quantisedAmount = dvf.token.toQuantizedAmount(token, amount)
  const tempVaultId = dvf.config.DVF.tempStarkVaultId
  const _nonce = dvf.util.generateRandomNonce()
  const starkTokenId = currency.starkTokenId
  const starkVaultId = await dvf.getVaultId(token, nonce, signature)

  const { starkPublicKey, starkKeyPair } = await dvf.stark.createKeyPair(
    starkPrivateKey
  )

  // This should be in hours
  const expireTime =
    Math.floor(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  const tradingKey = `0x${starkPublicKey.x}`
  const { starkMessage } = dvf.stark.createTransferMsg(
    quantisedAmount,
    _nonce,
    tempVaultId,
    starkTokenId,
    starkVaultId,
    tradingKey,
    expireTime
  )

  const starkSignature = dvf.stark.sign(starkKeyPair, starkMessage)

  const url = dvf.config.api + '/v1/trading/w/deposit'

  const data = {
    token,
    amount,
    nonce: _nonce,
    starkPublicKey,
    starkSignature,
    starkVaultId,
    expireTime
  }
  // console.log({ data })

  await dvf.contract.approve(token, dvf.token.toBaseUnitAmount(token, amount), dvf.config.DVF.starkExContractAddress, 'ETHEREUM')

  const depositResponse = await post(url, { json: data })

  const { status, transactionHash } = await dvf.contract.deposit(
    tempVaultId,
    token,
    amount,
    tradingKey
  )

  if (!status) {
    throw new DVFError('ERR_ONCHAIN_DEPOSIT')
  }

  return { ...depositResponse, transactionHash }
}
