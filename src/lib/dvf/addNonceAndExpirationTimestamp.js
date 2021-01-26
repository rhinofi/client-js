const getExpirationTimestampInHours = require('./getExpirationTimestampInHours')

module.exports = dvf => transaction => {
  const expirationTimestamp = transaction.expirationTimestamp || getExpirationTimestampInHours(dvf)
  const nonce = transaction.nonce || dvf.util.generateRandomNonce()

  return {
    ...transaction,
    nonce,
    expirationTimestamp
  }
}
