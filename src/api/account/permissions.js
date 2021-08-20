const post = require('../../lib/dvf/post-authenticated')

/**
 * Get all permissions for the authenticated user
 */
const getPermissions = (dvf, nonce, signature) => {
  const endpoint = '/v1/trading/r/getPublicUserPermissions'

  return post(dvf, endpoint, nonce, signature, {})
}

/**
 * Set a certain permission for the authenticated user
 * @param {string} key permission key
 * @param {boolean} value permission value
 */
const setPermissions = (dvf, { key, value }, nonce, signature) => {
  const endpoint = '/v1/trading/r/setPublicUserPermissions'

  return post(dvf, endpoint, nonce, signature, { key, value })
}

module.exports = {
  getPermissions,
  setPermissions
}
