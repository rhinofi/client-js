/**
 * Check if a token is approved for locking
 */
module.exports = (efx, token) => {
  // REVIEW: shall we throw if token is ETH or USDT ?
  const currency = efx.config['0x'].tokenRegistry[token]

  const args = [
    efx.get('account'), // address _owner
    currency.wrapperAddress // address _spender
  ]

  const action = 'allowance'

  return efx.eth.call(efx.contract.abi.token, currency.tokenAddress, action, args)
}
