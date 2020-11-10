const sw = require('starkware_crypto')

module.exports = (dvf, ...args) => {
  const message = (dvf.sw || sw).getTransferMsgHash(
    args[0], // amount (uint63 decimal str)
    args[1], // nonce (uint31)
    args[2], // temp vault id or sender_vault_id (uint31)
    args[3], // token (hex str with 0x prefix < prime)
    args[4], // user vault or receiver_vault_id (uint31)
    args[5], // receiver_public_key (hex str with 0x prefix < prime)
    args[6] // expiration_timestamp (uint22)
  )
  return { starkMessage: dvf.sw ? message.toString(16) : message }
}
