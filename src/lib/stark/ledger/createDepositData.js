module.exports = async (dvf, path, token, amount) => {
  const tempVaultId = dvf.config.DVF.tempStarkVaultId
  const starkVaultId = await dvf.getVaultId(token)

  const starkDeposit = await dvf.stark.ledger.createSignedTransfer(
    path,
    token,
    amount,
    tempVaultId,
    starkVaultId
  )
  starkDeposit.starkVaultId = starkVaultId

  return starkDeposit
}
