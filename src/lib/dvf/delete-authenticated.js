const addAuthHeadersOrData = require('./addAuthHeadersOrData')
const deleteGeneric = require('./delete-generic')

module.exports = async (dvf, endpoint, nonce, signature, data = {}) => {
  const { headers, data: json } = await addAuthHeadersOrData(
    dvf, nonce, signature, { data }
  )
  return deleteGeneric(dvf, endpoint, json, headers)
}
