const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, nonce, signature) => {
  validateAssertions(dvf, {token})

  const existingVaultId = dvf.config.tokenRegistry[token].starkVaultId
  if (existingVaultId != null) {
    return existingVaultId
  }
  else {
    const endpoint = '/v1/trading/r/getVaultId'
    const data = { token }

    const vaultId = await dvf.getVaultIdFromServer(token, nonce, signature)

    dvf.config.tokenRegistry[token].starkVaultId = vaultId

    return vaultId
  }
}
