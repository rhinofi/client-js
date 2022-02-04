const { post } = require('request-promise')
const _ = require('lodash')

module.exports = async (dvf, endpoint, json = {}, headers = {}) => {
  const url = dvf.config.api + endpoint
  headers = { ...headers, Authorization: dvf.config.apiKey }

  const options = {
    uri: url,
    headers,
    // removes null and undefined values
    json: _.omitBy(json, _.isNil)
  }

  return post(options)
}
