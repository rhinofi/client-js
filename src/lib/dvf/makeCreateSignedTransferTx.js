const createSignedTransfer = require('./createSignedTransfer')

module.exports = dvf => async data => {
  const {
    recipientPublicKey,
    recipientVaultId,
    tokenInfo,
    quantisedAmount
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
    type: 'TransferRequest'
  }

  return {
    tx: await createSignedTransfer(dvf)(txParams),
    starkPublicKey
  }
}
