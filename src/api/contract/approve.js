const reasons = require('../../lib/dvf/DVFError')
/**
 * Approves a token for locking
 *
 */
module.exports = async (efx, token) => {
  const currency = efx.token.getTokenInfo(token)

  const amount = (2 ** 256 - 1).toString(16)

  const args = [
    currency.wrapperAddress, // address _spender
    amount // uint amount
  ]

  // TODO: review error format
  if (token === 'USD' && (await efx.contract.isApproved(token)) !== 0) {
    return {
      error: 'ERR_TRADING_ETHFX_CANT_APPROVE_USDT_TWICE',
      reason: reasons.ERR_TRADING_ETHFX_CANT_APPROVE_USDT_TWICE.trim(),
      originalError: e
    }
  }

  if (token === 'ETH') {
    return {
      error: 'ERR_TRADING_ETHFX_APPROVE_ETH_NOT_REQUIRED',
      reason: reasons.ERR_TRADING_ETHFX_APPROVE_ETH_NOT_REQUIRED.trim(),
      originalError: e
    }
  }

  const action = 'approve'

  return efx.eth.send(
    efx.contract.abi.token,
    currency.tokenAddress,
    action,
    args
  )
}
