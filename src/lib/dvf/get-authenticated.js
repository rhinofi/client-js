const getGeneric = require('./get-generic')
const addAuthHeadersOrData = require('./addAuthHeadersOrData')

module.exports = async (dvf, endpoint, nonce, signature, data = {}) => {
  const { headers, data: qs } = await addAuthHeadersOrData(
    dvf, nonce, signature, { data }
  )
  return getGeneric(dvf, endpoint, qs, headers)
}
