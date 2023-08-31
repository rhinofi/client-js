const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, nonce, signature) => {
  validateAssertions(dvf, { token })

  const existingVaultId = dvf.config.tokenRegistry[token].starkVaultId
  const existingDeversifiVaultId =
    dvf.config.tokenRegistry[token].deversifiStarkVaultId
  if (existingVaultId != null && existingDeversifiVaultId != null) {
    return {
      starkVaultId: existingVaultId,
      deversifiStarkVaultId: existingDeversifiVaultId
    }
  } else {
    const { starkVaultId, deversifiStarkVaultId } = await dvf
      .getVaultIdAndDeversifiVaultIdFromServer(token, nonce, signature)

    dvf.config.tokenRegistry[token].starkVaultId = starkVaultId
    dvf.config.tokenRegistry[token].deversifiStarkVaultId =
      deversifiStarkVaultId

    return { starkVaultId, deversifiStarkVaultId }
  }
}
