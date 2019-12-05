/**
 * Signs toSign assyncronously
 *
 * For more information, check:
 * https://web3js.readthedocs.io/en/1.0/web3-eth.html#sign
 */

module.exports = (efx, toSign) => {
  // metamask will take care of the 3rd parameter, "password"
  if (efx.web3.currentProvider.isMetaMask) {
    return efx.web3.eth.personal.sign(toSign, efx.get('account'))
  } else {
    return efx.web3.eth.sign(toSign, efx.get('account'))
  }
}
