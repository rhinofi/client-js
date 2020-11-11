/**
 * Signs toSign assyncronously
 *
 * For more information, check:
 * https://web3js.readthedocs.io/en/1.0/web3-eth.html#sign
 */

module.exports = async (dvf, toSign) => {
  // metamask will take care of the 3rd parameter, "password"
  if (dvf.web3.currentProvider.isMetaMask) {
    return dvf.web3.eth.personal.sign(toSign, dvf.get('account'))
  } else if (dvf.config.useTradingKey) {
    const starkKey = await dvf.config.starkProvider.getStarkKey()
    return dvf.stark.sign(starkKey, toSign)
  } else {
    return dvf.web3.eth.sign(toSign, dvf.get('account'))
  }
}
