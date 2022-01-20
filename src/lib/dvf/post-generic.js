const { post } = require('request-promise')
const _omitBy = require('lodash/omitBy')
const _isNil = require('lodash/isNil')

module.exports = async (dvf, endpoint, json = {}, headers = {}) => {
  const url = dvf.config.api + endpoint

  const options = {
    uri: url,
    headers,
    // removes null and undefined values
    json: _omitBy(json, _isNil)
  }

  return post(options)
}
