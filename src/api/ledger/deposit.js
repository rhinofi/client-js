const { post } = require('request-promise')
const validateAssertions = require('../../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, starkDeposit) => {
  validateAssertions(dvf, {
    token,
    amount
  })

  // console.log({ currency })
  const nonce = starkDeposit.nonce
  const starkVaultId = starkDeposit.starkVaultId
  const expireTime = starkDeposit.expireTime
  const starkPublicKey = starkDeposit.starkPublicKey
  const starkSignature = starkDeposit.starkSignature

  // TODO: This could be updated to send starkDeposit
  // However this will require updates to public api
  // and public api reference documents

  const data = {
    token,
    amount,
    nonce,
    starkPublicKey,
    starkSignature,
    starkVaultId,
    expireTime
  }

  const url = dvf.config.api + '/v1/trading/w/deposit'

  // console.log(data)
  const depositResponse = await post(url, { json: data })

  await dvf.getUserConfig()

  return depositResponse
}
