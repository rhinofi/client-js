const { post } = require('request-promise')
const parse = require('../lib/parse/response/submit_order')
const sw = require('starkware_crypto')

module.exports = async (efx, token) => {
  if (!token) {
    throw new Error('token is missing')
  }
  const userAddress = efx.get('account')

  // TODO: check if symbol is a valid symbol

  // TODO:
  // Parameters to be available at client side
  // Generic Parameters
  // User Specific Parameters
  var private_key =
    '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'

  const { starkKey } = efx.stark.getKeyPairs(private_key)

  const data = {
    token,
    userAddress,
    starkKey
  }

  const url = efx.config.api + '/stark/getBalance'
  console.log(`about to call dvf pub api`)
  return post(url, { json: data })
}
