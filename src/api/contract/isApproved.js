/**
 * Check if a token is approved for locking
 */
module.exports = (dvf, token, spender = dvf.config.DVF.starkExContractAddress) => {
  // REVIEW: shall we throw if token is ETH or USDT ?
  const currency = dvf.token.getTokenInfo(token)

  const args = [
    dvf.get('account'), // address _owner
    spender // address _spender
  ]

  const action = 'allowance'

  return dvf.eth.call(
    dvf.contract.abi.token,
    currency.tokenAddress,
    action,
    args
  )
}
