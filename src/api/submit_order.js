const { post } = require('request-promise')
const sw = require('starkware_crypto')

module.exports = async (
  efx,
  symbol,
  amount,
  price,
  gid,
  cid,
  signedOrder,
  validFor,
  partner_id,
  fee_rate,
  dynamicFeeRate,
  vault_id_buy,
  vault_id_sell
) => {
  if (!(symbol && amount && price)) {
    throw new Error('order, symbol, amount and price are required')
  }

  const userAddress = efx.get('account')

  // TODO:
  // User Specific Parameters to be retrieved via getUserConfig
  var private_key = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
  var key_pair = sw.ec.keyFromPrivate(private_key, 'hex')
  var public_key = sw.ec.keyFromPublic(key_pair.getPublic(true, 'hex'), 'hex')
  const starkKey = public_key.pub.getX().toString()
  const starkKeyPair = key_pair

  const { starkOrder, starkMessage } = efx.stark.createOrder(
    symbol,
    amount,
    price,
    validFor,
    fee_rate,
    vault_id_buy,
    vault_id_sell
  )
  const starkSignature = efx.stark.signOrder(starkKeyPair, starkMessage)

  const type = 'EXCHANGE LIMIT'
  const protocol = 'stark'
  symbol = 't' + symbol
  const data = {
    gid,
    cid,
    type,
    symbol,
    amount,
    price,
    meta: {},
    protocol,
    partner_id,
    fee_rate,
    dynamicFeeRate
  }

  data.meta = {
    starkOrder: starkOrder,
    starkMessage: starkMessage,
    userAddress: userAddress,
    starkKey: starkKey,
    starkSignature: starkSignature
  }

  const url = efx.config.api + '/stark/submitOrder'
  console.log(`about to call dvf pub api`)
  return post(url, { json: data })
}
