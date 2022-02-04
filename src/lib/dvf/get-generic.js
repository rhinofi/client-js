const { get } = require('request-promise')
const _ = require('lodash')

module.exports = async (dvf, endpoint, qs = {}, headers = {}) => {
  const url = dvf.config.api + endpoint
  headers = { ...headers, Authorization: dvf.config.apiKey }

  const options = {
    uri: url,
    headers,
    // removes null and undefined values
    qs: _.omitBy(qs, _.isNil),
    json: true
  }

  return get(options)
}
