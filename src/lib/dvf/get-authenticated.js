const { get } = require('request-promise')
const _ = require('lodash')

module.exports = async (dvf, endpoint, nonce, signature, data = {}) => {
  const url = dvf.config.api + endpoint

  if (!nonce || !signature) {
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

  return get(url, { json: data })
}
