const makeAuthHeaders = require('./makeAuthHeaders')

module.exports = async (dvf, nonce, signature, { headers = {}, data = {} }) => {
  if (dvf.config.useTradingKey || dvf.config.useSignature) {
    headers = { ...headers, ...makeAuthHeaders(dvf, nonce, signature) }
  } else {
    if (!nonce || !signature) {
      ({ nonce, signature } = await dvf.sign.nonceSignature(nonce, signature))
    }

    data = { ...data, nonce, signature }
  }

  return { headers, data }
}
