const BigNumber = require('bignumber.js')

module.exports = async (dvf, vaultId, token, amount, ownerAddress) => {
  console.log('dvf ->', dvf.config)
  const currency = dvf.config.tokenRegistry[token]
  const value = new BigNumber(10)
    .pow(currency.decimals)
    .times(amount)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString()

  // TODO: function should have input for token currency, and then select first arg from config
  const args = [dvf.config.tokenRegistry[token].starkTokenId, vaultId, amount]

  const action = 'deposit'
  console.log({ args })
  // In order to lock ETH we simply send ETH to the lockerAddress
  if (token === 'ETH') {
    return dvf.eth.send(
      dvf.contract.abi.StarkEx,
      dvf.config.DVF.starkExContractAddress,
      action,
      args,
      value // send ETH to the contract
    )
  }

  try {
    return dvf.eth.send(
      dvf.contract.abi.StarkEx,
      dvf.config.DVF.exchangeAddress,
      action,
      args
    )
  } catch (e) {
    if (!dvf.contract.isApproved(token)) {
      return {
        error: 'ERR_CORE_ETHFX_NEEDS_APPROVAL',
        reason: reasons.ERR_CORE_ETHFX_NEEDS_APPROVAL.trim()
      }
    } else {
      throw e
    }
  }
}
