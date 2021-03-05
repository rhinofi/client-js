const { post } = require('request-promise')
const validateAssertions = require('../../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, nonce, signature) => {
  validateAssertions(dvf, { amount, token })
  const tempVaultId = dvf.config.DVF.tempStarkVaultId || '1'
  const depositAmount = dvf.util.prepareDepositAmount(amount, token)
  const starkVaultId = await dvf.getVaultId(token, nonce, signature)
  // TODO: Refactor so signing function gets quantizedAmount and tokenInfo
  const starkDeposit = await dvf.stark.authereum.createSignedTransfer(
    token,
    depositAmount,
    tempVaultId,
    starkVaultId
  )

  const data = {
    token,
    amount,
    starkVaultId,
    nonce: starkDeposit.nonce,
    starkPublicKey: starkDeposit.starkPublicKey,
    starkSignature: starkDeposit.starkSignature,
    expireTime: starkDeposit.expireTime
  }

  const url = dvf.config.api + '/v1/trading/w/deposit'
  const deposit = await post(url, {json: data})
  const ctDeposit = await dvf.contract.deposit(tempVaultId, token, amount, `0x${starkDeposit.starkPublicKey.x}`)

  return {...deposit, ...ctDeposit}
}
