const DVFError = require('../../lib/dvf/DVFError')
/**
 * Approves a token for locking
 *
 */
module.exports = async (dvf, token, deposit) => {
  if (token === 'ETH') { return true }

  const currency = dvf.token.getTokenInfo(token)

  const amount = (2 ** 256 - 1).toString(16)

  if (!deposit) { deposit = amount }

  const allowance = parseInt(await dvf.contract.isApproved(token))

  const action = 'approve'

  if (allowance > deposit) { return true }

  if (token === 'USDT' && allowance !== 0) {
    const args = [
      dvf.config.DVF.starkExContractAddress, // address _spender
      0
    ]
    await dvf.eth.send(dvf.contract.abi.token, currency.tokenAddress, action, args)
  }

  const args = [
    dvf.config.DVF.starkExContractAddress, // address _spender
    amount // uint amount
  ]

  if (token === 'ETH') {
    throw new DVFError('ERR_TRADING_ETHFX_APPROVE_ETH_NOT_REQUIRED')
  }

  return dvf.eth.send(
    dvf.contract.abi.token,
    currency.tokenAddress,
    action,
    args
  )
}
