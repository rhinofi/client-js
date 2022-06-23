module.exports = dvf => async data => {
  const {
    recipientPublicKey,
    recipientVaultId,
    tokenInfo,
    quantisedAmount,
    quantisedFeeAmount
  } = data
  // dvfStarkProvider abstracts specifics of how a public key is obtained.
  const { dvfStarkProvider } = dvf
  const starkPublicKey = await dvfStarkProvider.getPublicKey()

  const txParams = {
    amount: quantisedAmount.toString(),
    senderPublicKey: `0x${starkPublicKey.x}`,
    receiverPublicKey: recipientPublicKey,
    receiverVaultId: recipientVaultId,
    senderVaultId: tokenInfo.starkVaultId,
    token: tokenInfo.starkTokenId,
    ...(quantisedFeeAmount
      ? {
          feeInfoUser: {
            feeLimit: quantisedFeeAmount.toString(),
            // Same as sender vaultId
            sourceVaultId: tokenInfo.starkVaultId,
            // Same as token
            tokenId: tokenInfo.starkTokenId
          }
        }
      : {}
    ),
    type: 'TransferRequest'
  }

  return {
    tx: await dvf.createSignedTransfer(txParams),
    starkPublicKey
  }
}
