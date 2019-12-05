const { post } = require('request-promise')
const parse = require('../lib/parse/response/release_tokens')
const reasons = require('../lib/error/reasons.js')

module.exports = async (efx, token, nonce, signature) => {
  const url = efx.config.api + '/w/releaseTokens'

  const currency = efx.config['0x'].tokenRegistry[token]

  if (!nonce) {
    nonce = ((Date.now() / 1000) + 30) + ''

    signature = await efx.sign(nonce.toString(16))
  } else {
    if(!signature){
      // TODO: review error format
      return {
        error: 'ERR_RELEASE_TOKENS_NONCE_REQUIRES_SIGNATURE',
        reason: reasons.ERR_RELEASE_TOKENS_NONCE_REQUIRES_SIGNATURE.trim()
      }
    }
  }

  const protocol = '0x'

  const data = {
    nonce,
    signature,
    tokenAddress: currency.wrapperAddress,
    protocol
  }

  return parse(post(url, {json: data}))
}
