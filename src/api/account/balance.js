/**
 * Returns ETH balance
 */
module.exports = (dvf) => {
  return dvf.web3.eth.getBalance(dvf.get('account'))
}
