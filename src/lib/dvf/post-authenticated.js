const addAuthHeadersOrData = require('./addAuthHeadersOrData')
const postGeneric = require('./post-generic')

module.exports = async (dvf, endpoint, nonce, signature, data = {}) => {
  const { headers, data: json } = await addAuthHeadersOrData(
    dvf, nonce, signature, { data }
  )
  return postGeneric(dvf, endpoint, json, headers)
}
