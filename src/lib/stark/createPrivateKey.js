const crypto = require('crypto')

// TODO: Add check to ensure private key generated
//       is less than penderson EC_ORDER
module.exports = () => {
  return crypto.randomBytes(31).toString('hex')
}
