const createSignedTransaction = require('../dvf/createSignedTransaction')
const addNonceAndExpirationTimestamp = require('../dvf/addNonceAndExpirationTimestamp')

module.exports = dvf => path => async data => {
  const {
    recipientPublicKey,
    recipientVaultId,
    tokenInfo,
    quantisedAmount,
    quantisedFeeAmount
  } = data
  const starkPublicKey = await dvf.stark.ledger.getPublicKey(path)

  let tx = {
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

  tx = addNonceAndExpirationTimestamp(dvf.config)(tx)
  const { signature } = await createSignedTransaction(dvf)(tx)
  tx.signature = signature

  return {
    starkPublicKey,
    tx
  }
}
