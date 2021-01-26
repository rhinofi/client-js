module.exports = async (dvf, path, token, amount, tempVaultId, nonce, signature) => {
  const starkVaultId = await dvf.getVaultId(token, nonce, signature)
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
