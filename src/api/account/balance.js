/**
 * Returns ETH balance
 */
module.exports = (efx) => {
  return efx.web3.eth.getBalance(efx.get('account'))
}
