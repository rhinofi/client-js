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
    signature = dvf.sign(nonce.toString(16))
  }
  return { nonce, signature }
}
