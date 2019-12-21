const { post } = require('request-promise')
const validAssertions = require('../lib/validators/validateAssertions')

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
  let assertionError = await validAssertions({efx, amount, symbol, price, starkKey, starkKeyPair})
  if (assertionError) return assertionError

  const ownerAddress = efx.get('account')
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
    ownerAddress: ownerAddress,
    starkKey: starkKey,
    starkSignature: starkSignature
  }

  const url = efx.config.api + '/w/submitOrder'
  console.log(`about to call dvf pub api`)
  return post(url, { json: data })
}
