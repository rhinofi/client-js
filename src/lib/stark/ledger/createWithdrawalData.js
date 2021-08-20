module.exports = async (dvf, path, token, amount) => {
  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
  const quantizedAmount = dvf.token.toQuantizedAmount(token, amount)
  const tempVaultId = dvf.config.DVF.tempStarkVaultId
  let starkVaultId = tokenInfo.starkVaultId

  const starkWithdrawal = await dvf.stark.ledger.createSignedTransfer(
    path,
    tokenInfo,
    quantizedAmount,
    starkVaultId,
    tempVaultId
  )
  starkWithdrawal.starkVaultId = starkVaultId
  return starkWithdrawal
}
