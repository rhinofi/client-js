/**
 * Returns the amount you have locked for given token
 */
module.exports = (efx, token) => {
  const currency = efx.config['0x'].tokenRegistry[token]
  const action = 'balanceOf'
  const args = [ efx.get('account') ]

  return efx.eth.call(efx.contract.abi.locker, currency.wrapperAddress, action, args)
}
