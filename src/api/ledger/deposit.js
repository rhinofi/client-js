const { post } = require('request-promise')
const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')
const validateAssertions = require('../../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, path) => {
  validateAssertions(dvf, { amount, token })

  const currency = dvf.token.getTokenInfo(token)
  // console.log({ currency })
  const quantisedAmount = dvf.token.toQuantizedAmount(token, amount)
  const tempVaultId = dvf.config.DVF.tempStarkVaultId
  const nonce = dvf.util.generateRandomNonce()
  const starkTokenId = currency.starkTokenId
  let starkVaultId = currency.starkVaultId
  const transferTokenAddress = currency.tokenAddress
  const transferQuantization = new BN(currency.quantization)
  const amountTransfer = new BN(dvf.token.toBaseUnitAmount(token, amount))
  expireTime =
    Math.floor(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  if (!starkVaultId) {
    starkVaultId = dvf.config.spareStarkVaultId
  }

  const {
    starkKey,
    starkSignature
  } = await dvf.stark.ledger.createSignedTransfer(
    path, // string a path in BIP 32 format
    transferTokenAddress, // string?
    transferQuantization, // BigNumber quantization used for the token to be transferred
    tempVaultId, // number ID of the source vault
    starkVaultId, // number ID of the destination vault
    amountTransfer, // BigNumber amount to transfer
    nonce, // number transaction nonce
    expireTime // number transaction validity timestamp
  )

  // console.log({ starkKey, starkSignature })
  // const { status, transactionHash } = await dvf.contract.deposit(
  //   tempVaultId,
  //   token,
  //   amount
  // )

  // used for testing without making onchain contract call
  const { status, transactionHash } = { status: true, transactionHash: '0xabc' }

  if (!status) {
    throw new DVFError('ERR_ONCHAIN_DEPOSIT')
  }

  const url = dvf.config.api + '/v1/trading/w/deposit'

  starkPublicKey = {
    x: starkKey
  }

  const data = {
    token,
    amount,
    nonce,
    starkPublicKey,
    starkSignature,
    starkVaultId,
    expireTime,
    ethTxHash: transactionHash
  }
  //console.log({ data })

  const depositResponse = await post(url, { json: data })

  await dvf.getUserConfig()

  return depositResponse
}
