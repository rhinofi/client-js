/**
 * Alt lib for authenticed requests, uses dvf-utils request
 * and allows cancellable signal
 */
const { request } = require('dvf-utils')
const addAuthHeadersOrData = require('./addAuthHeadersOrData')

module.exports = async (dvf, method, endpoint, nonce, signature, {
  data = {},
  headers = {},
  signal = null
} = {}) => {
  const { headers: requestHeaders, data: requestData } = await addAuthHeadersOrData(
    dvf, nonce, signature, { headers, data }
  )

  const dataKey = method === 'get' ? 'qs' : 'data'

  return request[method](dvf.config.api + endpoint, {
    headers: requestHeaders,
    [dataKey]: requestData,
    signal
  })
}
