const { post } = require('request-promise')
const sw = require('starkware_crypto')
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
  const assertionError = await validAssertions({
    dvf,
    amount,
    symbol,
    price,
    starkPrivateKey
  })
  if (assertionError) return assertionError

  const ethAddress = dvf.get('account')

  const { starkOrder, starkMessage } = dvf.stark.createStarkOrder(
    symbol,
    amount,
    price,
    validFor,
    feeRate
  )
  const { starkKeyPair, starkPublicKey } = dvf.stark.createRawStarkKeyPair(
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
    starkOrder: starkOrder,
    starkMessage: starkMessage,
    ethAddress: ethAddress,
    starkKey: starkPublicKey.x,
    starkSignature: starkSignature
  }
  //console.log(data, data.meta, starkOrder, starkSignature)
  const url = dvf.config.api + '/v1/trading/w/submitOrder'
  return post(url, { json: data })
}
