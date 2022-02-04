const makeAuthHeaders = require('./makeAuthHeaders')

module.exports = async (dvf, nonce, signature, { headers = {}, data = {} }) => {
  if (
    // if any of these is set, don't generated nonce/signature as they are
    // expected to be passed in by the caller.
    // TODO: change this, so that nonce/signature can always be generated
    // automatically and is cached on the clients state.
    !dvf.config.useTradingKey && !dvf.config.useSignature &&
    (nonce == null || !signature)
  ) {
    ({ nonce, signature } = await dvf.sign.nonceSignature(nonce, signature))
  }

  if (dvf.config.useAuthHeader || dvf.config.useTradingKey || dvf.config.useSignature) {
    headers = { ...headers, ...makeAuthHeaders(dvf, nonce, signature), Authorization: dvf.config.apiKey }
  } else {
    data = { ...data, nonce, signature }
    headers = { ...headers, Authorization: dvf.config.apiKey }
  }

  return { headers, data }
}
