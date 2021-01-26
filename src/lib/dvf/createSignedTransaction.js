// Logic common to all stark transaction.
// Takes transaction with all props apart from nonce and expirationTimestamp
// and returns one with those props as well a signature added.
const addNonceAndExpirationTimestamp = require('./addNonceAndExpirationTimestamp')

module.exports = dvf => async transaction => {
  // dvfStarkProvider abstracts specifics of how a transaction is signed.
  const { dvfStarkProvider } = dvf

  transaction = addNonceAndExpirationTimestamp(dvf)(transaction)
  const signature = await dvfStarkProvider.sign(transaction)

  return { ...transaction, signature }
}
