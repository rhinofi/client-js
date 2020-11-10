module.exports = async (dvf, path, token, amount) => {
  const currency = dvf.token.getTokenInfo(token)
  const tempVaultId = dvf.config.DVF.tempStarkVaultId
  let starkVaultId = currency.starkVaultId

  const starkWithdrawal = await dvf.stark.ledger.createSignedTransfer(
    path,
    token,
    amount,
    starkVaultId,
    tempVaultId
  )
  starkWithdrawal.starkVaultId = starkVaultId
  return starkWithdrawal
}
