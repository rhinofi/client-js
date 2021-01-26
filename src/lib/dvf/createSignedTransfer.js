const createSignedTransaction = require('./createSignedTransaction')
const DVFError = require('./DVFError')

module.exports = dvf => async transferTransaction => {
  // dvfStarkProvider abstracts specifics of how a public key is obtained.
  const { dvfStarkProvider } = dvf
  const starkPublicKey = await dvfStarkProvider.getPublicKey()

  const senderPublicKey = `0x${starkPublicKey.x}`

  const existingSenderPublicKey = transferTransaction.senderPublicKey
  if (
    existingSenderPublicKey &&
    senderPublicKey !== existingSenderPublicKey
  ) {
    throw new DVFError(
      'Unexpected senderPublicKey',
      { expected: senderPublicKey, actual: existingSenderPublicKey }
    )
  }

  return createSignedTransaction(dvf)({
    ...transferTransaction,
    senderPublicKey
  })
}
