const { request } = require('@rhino.fi/dvf-utils')
const _omitBy = require('lodash/omitBy')
const _isNil = require('lodash/isNil')

module.exports = async (dvf, endpoint, qs = {}, headers = {}) => {
  const url = dvf.config.api + endpoint

  const options = {
    headers,
    // removes null and undefined values
    qs: _omitBy(qs, _isNil)
  }

  return request.get(url, options)
}
