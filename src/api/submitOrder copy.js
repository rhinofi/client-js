const { post } = require('request-promise')
const validAssertions = require('../lib/validators/validateAssertions')

module.exports = async (
  dvf,
  gid,
  cid,
  partnerId,
  feeRate = 0.0025,
  orderMetaData
) => {
  const ethAddress = dvf.get('account')
  const type = 'EXCHANGE LIMIT'
  const protocol = 'stark'
  const data = {
    cid,
    gid,
    type,
    symbol: orderMetaData.symbol,
    amount: orderMetaData.amount,
    price: orderMetaData.price,
    meta: {},
    protocol,
    partnerId,
    feeRate
  }

  data.meta = {
    ethAddress,
    starkPublicKey: orderMetaData.starkPublicKey,
    starkOrder: orderMetaData.starkOrder,
    starkMessage: orderMetaData.starkMessage,
    starkSignature: orderMetaData.starkSignature
  }

  const url = dvf.config.api + '/v1/trading/w/submitOrder'

  const submitResponse = await post(url, { json: data })

  await dvf.getUserConfig()

  return submitResponse
}
