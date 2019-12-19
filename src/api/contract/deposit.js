const BigNumber = require('bignumber.js')

module.exports = (efx, vaultId, token, amount, ownerAddress) => {
  console.log('efx ->', efx.config)

  const value = (new BigNumber(10)).pow(currency.decimals).times(amount).integerValue(BigNumber.ROUND_FLOOR).toString()

  // TODO: function should have input for token currency, and then select first arg from config
  const args = [
    efx.config.tokenRegistry[token].starkTokenId,
    vaultId,
    value
  ]
  const action = 'deposit'

  // In order to lock ETH we simply send ETH to the lockerAddress
  if (token === 'ETH') {
    return efx.eth.send(
      efx.contract.abi.StarkEx,
      efx.config.DVF.exchangeAddress,
      action,
      args,
      value // send ETH to the contract
    )
  }

  try {
    return efx.eth.send(
      efx.contract.abi.StarkEx,
      efx.config.DVF.exchangeAddress,
      action,
      args
    )
  } catch (e) {
    if (!efx.contract.isApproved(token)) {
      return {
        error: 'ERR_CORE_ETHFX_NEEDS_APPROVAL',
        reason: reasons.ERR_CORE_ETHFX_NEEDS_APPROVAL.trim()
      }
    } else {
      throw (e)
    }
  }
}
