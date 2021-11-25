const errorReasons = require('../../lib/dvf/errorReasons')

module.exports = async (dvf, vaultId, token, amount, tradingKey) => {
  let value
  tradingKey = tradingKey || dvf.config.starkKeyHex

  if (token === 'ETH') {
    value = dvf.token.toBaseUnitAmount(token, amount)
  } else {
    value = dvf.token.toQuantizedAmount(token, amount)
  }

  const args = [tradingKey, dvf.token.getTokenInfo(token).starkTokenId, vaultId, value]

  const action = 'deposit'
  // In order to lock ETH we simply send ETH to the lockerAddress
  if (token === 'ETH') {
    args.pop()
    return dvf.eth.send(
      dvf.contract.abi.getStarkEx(),
      dvf.config.DVF.starkExContractAddress,
      action,
      args,
      value // send ETH to the contract
    )
  }

  try {
    return dvf.eth.send(
      dvf.contract.abi.getStarkEx(),
      dvf.config.DVF.starkExContractAddress,
      action,
      args
    )
  } catch (e) {
    // TODO: why are we not simply throwing here? We are not awaiting the send
    // so the error could only be caused by a bug in the block above but not
    // actual execution of the contract method (since it's async).
    if (!dvf.contract.isApproved(token)) {
      return {
        error: 'ERR_CORE_ETHFX_NEEDS_APPROVAL',
        reason: errorReasons.ERR_CORE_ETHFX_NEEDS_APPROVAL.trim(),
        originalError: e
      }
    } else {
      throw e
    }
  }
}
