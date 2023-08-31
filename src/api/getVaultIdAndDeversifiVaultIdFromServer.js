const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = (dvf, token, nonce, signature) =>
  dvf.postAuthenticated(
    '/v1/trading/r/getVaultIdAndDeversifiVaultId',
    nonce,
    signature,
    { token }
  )
