const {post} = require('request-promise')
const stableCoins = require('./stableCoins')

// TODO: move address to api.deversifi address
const BFX_API = 'https://api-pub.bitfinex.com/v2'

module.exports = async (token) => {
  if (stableCoins[token]) {
    return stableCoins[token]
  }

  const response = await post({
    url: BFX_API + `/calc/fx`,
    json: true,
    body: {
      ccy1: token,
      ccy2: 'USD'
    }
  })

  return response[0]
}
