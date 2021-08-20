module.exports = async (dvf, path, token, amount, tempVaultId, nonce, signature) => {
  const starkVaultId = await dvf.getVaultId(token, nonce, signature)
  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
  const quantizedAmount = dvf.token.toQuantizedAmount(token, amount)
  const starkDeposit = await dvf.stark.ledger.createSignedTransfer(
    path,
    tokenInfo,
    quantizedAmount,
    tempVaultId,
    starkVaultId
  )
  starkDeposit.starkVaultId = starkVaultId

  return starkDeposit
}
