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
  starkPrivateKey
) => {
  validAssertions(dvf, { amount, symbol, price, starkPrivateKey })

  const ethAddress = dvf.get('account')

  const { starkOrder, starkMessage } = dvf.stark.createOrder(
    symbol,
    amount,
    price,
    validFor,
    feeRate
  )

  const { starkKeyPair, starkPublicKey } = await dvf.stark.createKeyPair(
    starkPrivateKey
  )

  const starkSignature = dvf.stark.sign(starkKeyPair, starkMessage)

  const type = 'EXCHANGE LIMIT'
  const protocol = 'stark'
  const data = {
    cid,
    gid,
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
    starkOrder,
    starkMessage,
    ethAddress,
    starkPublicKey,
    starkSignature
  }

  const url = dvf.config.api + '/v1/trading/w/submitOrder'
  
  const submitRespose = await post(url, { json: data })

   await dvf.getUserConfig()

   return submitRespose
}
