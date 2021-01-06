const { get } = require('request-promise')
const _ = require('lodash')

const addAuthHeadersOrData = require('./addAuthHeadersOrData')

module.exports = async (dvf, endpoint, nonce, signature, data = {}) => {
  const url = dvf.config.api + endpoint

  const { headers, data: qs } = await addAuthHeadersOrData(
    dvf, nonce, signature, { data }
  )

  var options = {
    uri: url,
    headers,
    // removes null and undefined values
    qs: _.omitBy(qs, _.isNil),
    json: true
  }

  return get(options)
}
