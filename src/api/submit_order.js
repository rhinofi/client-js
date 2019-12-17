const { post } = require('request-promise')

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
  starkKey,
  starkKeyPair
) => {
  if (!(symbol && amount && price)) {
    throw new Error('order, symbol, amount and price are required')
  }
  if (!(starkKey && starkKeyPair)) {
    throw new Error(`starkKey or starkKeyPair missing`)
  }

  const userAddress = efx.get('account')
  const vaultIdBuy = efx.config.tokenRegistry['ZRX'].starkVaultId
  const vaultIdSell = efx.config.tokenRegistry['ETH'].starkVaultId

  // TODO:
  const { starkOrder, starkMessage } = efx.stark.createOrder(
    symbol,
    amount,
    price,
    validFor,
    fee_rate,
    vaultIdBuy,
    vaultIdSell
  )

  const starkSignature = efx.stark.sign(starkKeyPair, starkMessage)
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

  const url = efx.config.api + '/w/submitOrder'
  console.log(`about to call dvf pub api`)
  return post(url, { json: data })
}
