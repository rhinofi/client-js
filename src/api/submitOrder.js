const { post } = require('request-promise')
const validAssertions = require('../lib/validators/validateAssertions')

module.exports = async (
  dvf,
  symbol,
  amount,
  price,
  gid,
  cid,
  signedOrder,
  validFor,
  partnerId,
  feeRate,
  dynamicFeeRate,
  starkKey,
  starkKeyPair
) => {
  const assertionError = await validAssertions({dvf, amount, symbol, price, starkKey, starkKeyPair})
  if (assertionError) return assertionError

  const ethAddress = dvf.get('account')

  const { starkOrder, starkMessage } = dvf.stark.createOrder(
    symbol,
    amount,
    price,
    validFor,
    feeRate
  )

  const starkSignature = dvf.stark.sign(starkKeyPair, starkMessage)
  const type = 'EXCHANGE LIMIT'
  const protocol = 'stark'
  const data = {
    gid,
    cid,
    type,
    symbol,
    amount,
    price,
    meta: {},
    protocol,
    partnerId,
    feeRate,
    dynamicFeeRate
  }

  data.meta = {
    starkOrder: starkOrder,
    starkMessage: starkMessage,
    ethAddress: ethAddress,
    starkKey: starkKey,
    starkSignature: starkSignature
  }

  const url = dvf.config.api + '/w/submitOrder'
  return post(url, { json: data })
}
