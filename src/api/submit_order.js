const {post} = require('request-promise')
const parse = require('../lib/parse/response/submit_order')

module.exports = async (efx, symbol, amount, price, gid, cid, signedOrder, validFor, partner_id, fee_rate, dynamicFeeRate) => {
  if (!(symbol && amount && price)) {
    throw new Error('order, symbol, amount and price are required')
  }

  if(!fee_rate) {
    if(!dynamicFeeRate){
      dynamicFeeRate = await efx.getFeeRate(symbol, amount, price)
    }

    fee_rate = dynamicFeeRate.feeRate.feeBps / 10000
  }

  //TODO: check if symbol is a valid symbol
  if(!signedOrder){
    const order = efx.contract.createOrder(symbol, amount, price, validFor, fee_rate)

    signedOrder = await efx.sign.order(order)
  }

  const meta = signedOrder

  const type = 'EXCHANGE LIMIT'

  const protocol = '0x'

  symbol = 't' + symbol

  const data = {
    gid,
    cid,
    type,
    symbol,
    amount,
    price,
    meta,
    protocol,
    partner_id,
    fee_rate,
    dynamicFeeRate
  }

  const url = efx.config.api + '/w/on'

  return parse(post(url, {json: data}))
}
