const sw = require('starkware_crypto')

module.exports = (...args) => {
  const message = sw.get_transfer_msg(
    (amount = args[0]), // amount (uint63 decimal str)
    (nonce = args[1]), // order_id (uint31)
    (sender_vault_id = args[2]), // temp vault id or sender_vault_id (uint31)
    (token = args[3]), // token (hex str with 0x prefix < prime)
    (receiver_vault_id = args[4]), // user vault or receiver_vault_id (uint31)
    (receiver_public_key = args[5]), // receiver_public_key (hex str with 0x prefix < prime)
    (expiration_timestamp = args[6]) // expiration_timestamp (uint22)
  )
  return { starkMessage: message }
}
