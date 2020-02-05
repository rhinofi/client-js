const DVFError = require('../../lib/dvf/DVFError')
/**
 * Approves a token for locking
 *
 */
module.exports = async (dvf, token) => {
  const currency = dvf.token.getTokenInfo(token)

  const amount = (2 ** 256 - 1).toString(16)

  const args = [
    dvf.config.DVF.starkExContractAddress, // address _spender
    amount // uint amount
  ]

  // TODO: review error format
  if (token === 'USD' && (await dvf.contract.isApproved(token)) !== 0) {
    throw new DVFError('ERR_TRADING_ETHFX_CANT_APPROVE_USDT_TWICE')
  }

  if (token === 'ETH') {
    throw new DVFError('ERR_TRADING_ETHFX_APPROVE_ETH_NOT_REQUIRED')
  }

  const action = 'approve'

  return dvf.eth.send(
    dvf.contract.abi.token,
    currency.tokenAddress,
    action,
    args
  )
}