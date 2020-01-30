/**
 *
 * if either nonce and signature are not provided a
 * new nonce and signature are created. if nonce and
 * signature were provided the same are returned back
 *
 */

module.exports = (dvf, nonce, signature) => {
  if (!(nonce && signature)) {
    nonce = Date.now() / 1000 + ''
    if (dvf.web3.currentProvider.isMetaMask) {
      signature = dvf.web3.eth.personal.sign(
        nonce.toString(16),
        dvf.get('account')
      )
    } else {
      signature = dvf.web3.eth.sign(nonce.toString(16), dvf.get('account'))
    }
    //signature = await dvf.sign(nonce.toString(16))
  }
  return { nonce, signature }
}
