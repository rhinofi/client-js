const { get } = require('request-promise')
const _ = require('lodash')

module.exports = async (dvf, endpoint, qs = {}, headers = {}) => {
  const url = endpoint.includes('market-data') ? 'https://api.deversifi.dev' + endpoint : dvf.config.api + endpoint

  const options = {
    uri: url,
    headers,
    // removes null and undefined values
    qs: _.omitBy(qs, _.isNil),
    json: true
  }

  return get(options)
}
