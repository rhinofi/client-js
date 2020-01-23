const BigNumber = require('bignumber.js')

module.exports = async (dvf, vaultId, token, amount, ethAddress) => {
  const currency = dvf.config.tokenRegistry[token]
  const value = new BigNumber(10)
    .pow(currency.decimals)
    .times(amount)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString()
  
  const args = [dvf.config.tokenRegistry[token].starkTokenId, vaultId, value]
  console.log('about to call deposit with args: ', args)
  const action = 'deposit'
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
      dvf.config.DVF.starkExContractAddress,
      action,
      args,
      value
    )
  } catch (e) {
    if (!dvf.contract.isApproved(token)) {
      return {
        error: 'ERR_CORE_ETHFX_NEEDS_APPROVAL',
        reason: reasons.ERR_CORE_ETHFX_NEEDS_APPROVAL.trim(),
        originalError: e
      }
    } else {
      throw e
    }
  }
}
