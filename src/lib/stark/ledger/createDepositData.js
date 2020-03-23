module.exports = async (dvf, path, token, amount) => {
  const currency = dvf.token.getTokenInfo(token)
  const tempVaultId = dvf.config.DVF.tempStarkVaultId
  let starkVaultId = currency.starkVaultId

  if (!starkVaultId) {
    starkVaultId = dvf.config.spareStarkVaultId
  }
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
