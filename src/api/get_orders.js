const { post } = require('request-promise')
const sw = require('starkware_crypto')

module.exports = async (efx, symbol, id, nonce) => {
  var url = efx.config.api + '/stark/getOrders'
  if (id === 'all') {
    if (symbol) { url += '/t' + symbol + '/hist' } else { url += '/hist' }
    // incase 'id' needs to be changed.
    id = null
  } else {
    if (symbol) { url += '/t' + symbol }
  }
  if (!nonce) { nonce = ((Date.now() / 1000) + 30) + '' }
  const protocol = '0x'

  // User Specific Parameters
  var private_key = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
  var key_pair = sw.ec.keyFromPrivate(private_key, 'hex')
  var public_key = sw.ec.keyFromPublic(key_pair.getPublic(true, 'hex'), 'hex')

  const starkKeyPair = key_pair
  const starkMessage = sw.get_transfer_msg(
    amount = 60, // amount (uint63 decimal str)
    nonce = '1', // order_id (uint31)
    sender_vault_id = '1', // temp vault id or sender_vault_id (uint31)
    token = '0x4e4543', // token, // token (hex str with 0x prefix < prime)
    receiver_vault_id = '2', // user vault or receiver_vault_id (uint31)
    receiver_public_key = '0x1', // receiver_public_key (hex str with 0x prefix < prime)
    expiration_timestamp = '9' // expiration_timestamp (uint22)
  )
  const signature = await sw.sign(starkKeyPair, starkMessage)

  const data = {
    id,
    nonce,
    signature,
    protocol
  }
  return post(url, { json: data })
}
