const getTokenAddressFromTokenInfoOrThrow = require('../../lib/dvf/token/getTokenAddressFromTokenInfoOrThrow')

/**
 * Check if a token is approved for locking
 */
module.exports = (dvf, token, chain, spender = dvf.config.DVF.starkExContractAddress) => {
  // REVIEW: shall we throw if token is ETH or USDT ?
  const tokenInfo = dvf.token.getTokenInfo(token)
  const tokenAddress = getTokenAddressFromTokenInfoOrThrow(tokenInfo, chain)

  const args = [
    dvf.get('account'), // address _owner
    spender // address _spender
  ]

  const action = 'allowance'

  return dvf.eth.call(
    dvf.contract.abi.token,
    tokenAddress,
    action,
    args,
    { chain }
  )
}
