const createSignedTransfer = require('./createSignedTransfer')

module.exports = dvf => async transferTransaction => {
  // dvfStarkProvider abstracts specifics of how a public key is obtained.
  const { dvfStarkProvider } = dvf
  const starkPublicKey = await dvfStarkProvider.getPublicKey()

  return {
    tx: await createSignedTransfer(dvf)(transferTransaction),
    starkPublicKey
  }
}
