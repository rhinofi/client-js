const { request } = require('@rhino.fi/dvf-utils')
const validateAssertions = require('../../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, starkWithdrawal) => {
  validateAssertions(dvf, {
    token,
    amount
  })

  // console.log({ currency })
  const nonce = starkWithdrawal.nonce
  const starkVaultId = starkWithdrawal.starkVaultId
  const expireTime = starkWithdrawal.expireTime
  const starkPublicKey = starkWithdrawal.starkPublicKey
  const starkSignature = starkWithdrawal.starkSignature

  // TODO: This could be updated to send starkWithdrawal
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

  //console.log({ data })
  const url = dvf.config.api + '/v1/trading/w/withdraw'
  
  return request.post(url, {
    json: data
  })
}
