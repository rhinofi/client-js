const { post } = require('request-promise')
const sw = require('starkware_crypto')

module.exports = async (efx, symbol, id, nonce) => {
  var url = efx.config.api + '/stark/getOrders'
  if (id === 'all') {
    if (symbol) {
      url += '/t' + symbol + '/hist'
    } else {
      url += '/hist'
    }
    // incase 'id' needs to be changed.
    id = null
  } else {
    if (symbol) {
      url += '/t' + symbol
    }
  }
  if (!nonce) {
    nonce = Date.now() / 1000 + 30 + ''
  }
  const protocol = '0x'

  // User Specific Parameters
  var private_key =
    '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
  const { starkKeyPair } = efx.stark.getKeyPairs(private_key)
  const { starkMessage } = efx.stark.getTransferMsg(
    60,
    '1',
    '1',
    '0x3',
    '2',
    '0x1',
    '9'
  )
  const signature = await efx.stark.sign(starkKeyPair, starkMessage)

  const data = {
    id,
    nonce,
    signature,
    protocol
  }
  return post(url, { json: data })
}
