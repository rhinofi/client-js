const {post} = require('request-promise')
const validateAssertions = require('../../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount) => {
  validateAssertions(dvf, {token, amount})

  const {starkVaultId} = dvf.token.getTokenInfo(token)
  const tempVaultId = dvf.config.DVF.tempStarkVaultId

  const starkWithdrawal = await dvf.stark.authereum.createSignedTransfer(
    token,
    amount,
    starkVaultId,
    tempVaultId
  )

  const data = {
    token,
    amount,
    starkVaultId,
    nonce: starkWithdrawal.nonce,
    starkPublicKey: starkWithdrawal.starkPublicKey,
    starkSignature: starkWithdrawal.starkSignature,
    expireTime: starkWithdrawal.expireTime
  }

  const url = dvf.config.api + '/v1/trading/w/withdraw'

  return post(url, {json: data})
}
