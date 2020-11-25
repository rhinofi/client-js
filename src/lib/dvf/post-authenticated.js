const {post} = require('request-promise')
const _ = require('lodash')

module.exports = async (dvf, endpoint, nonce, signature, data = {}) => {
  const url = dvf.config.api + endpoint

  const headers = {}
  if (nonce && signature && dvf.config.useTradingKey) {
    const bufferStarkAuthData = Buffer.from(JSON.stringify({signature, nonce}))
    const ecRecoverHeader = 'EcRecover ' + bufferStarkAuthData.toString('base64')
    headers.Authorization = ecRecoverHeader
  } else if (nonce && signature && dvf.config.useSignature) {
    const bufferStarkAuthData = Buffer.from(JSON.stringify({
      signature,
      nonce,
      ethAddress: dvf.get('account')
    }))
    const ecRecoverHeader = 'EcRecover ' + bufferStarkAuthData.toString('base64')
    headers.Authorization = ecRecoverHeader
  } else if (!nonce || !signature) {
    const newSignature = await dvf.sign.nonceSignature(nonce, signature)
    data = {
      ...data,
      ...newSignature
    }
  } else {
    data = {
      ...data,
      nonce,
      signature
    }
  }

  // removes null and undefined values
  data = _.omitBy(data, _.isNil)

  return post(url, {json: data, headers})
}
