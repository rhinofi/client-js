const makeAuthHeaders = require('./makeAuthHeaders')
const deleteGeneric = require('./delete-generic')

module.exports = async (dvf, endpoint, nonce, signature) => {
  const headers = makeAuthHeaders(dvf, nonce, signature)

  return deleteGeneric(dvf, endpoint, headers)
}
