/**
 *
 * if either nonce and signature are not provided a
 * new nonce and signature are created. if nonce and
 * signature were provided the same are returned back
 *
 */

module.exports = async (dvf, nonce, signature) => {
  if (!(nonce && signature)) {
    nonce = Date.now() / 1000
    signature = await dvf.sign(String(nonce).toString(16))
  }

  
  return {nonce, signature}
}
