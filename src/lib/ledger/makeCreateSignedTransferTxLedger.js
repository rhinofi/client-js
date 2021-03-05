
module.exports = dvf => path => async data => {
  const {
    recipientPublicKey,
    recipientVaultId,
    tokenInfo,
    quantisedAmount
  } = data
  const starkPublicKey = await dvf.stark.ledger.getPublicKey(path)

  const tx = {
    amount: quantisedAmount.toString(),
    senderPublicKey: `0x${starkPublicKey.x}`,
    receiverPublicKey: recipientPublicKey,
    receiverVaultId: recipientVaultId,
    senderVaultId: tokenInfo.starkVaultId,
    token: tokenInfo.starkTokenId,
    type: 'TransferRequest'
  }

  const {starkSignature, nonce, expireTime} = await dvf.stark.ledger.createSignedTransfer(
    path,
    tokenInfo,
    quantisedAmount,
    tx.senderVaultId,
    tx.receiverVaultId,
    tx.receiverPublicKey
  )

  return {
    starkPublicKey,
    tx: {
      ...tx,
      nonce,
      signature: {
        r: `0x${starkSignature.r}`,
        s: `0x${starkSignature.s}`
      },
      expirationTimestamp: expireTime
    }
  }
}
