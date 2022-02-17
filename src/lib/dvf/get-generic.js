const { get } = require('request-promise')
const _omitBy = require('lodash/omitBy')
const _isNil = require('lodash/isNil')

module.exports = async (dvf, endpoint, qs = {}, headers = {}) => {
  const url = dvf.config.api + endpoint

  const options = {
    uri: url,
    headers,
    // removes null and undefined values
    qs: _omitBy(qs, _isNil),
    json: true
  }

  return get(options)
}
