const {post} = require('request-promise')
const stableCoins = require('./stableCoins')

const DATA_API = 'https://api.deversifi.com/bfx/v2/'

module.exports = async (token) => {
  if (stableCoins[token]) {
    return stableCoins[token]
  }

  const response = await post({
    url: DATA_API + `/calc/fx`,
    json: true,
    body: {
      ccy1: token,
      ccy2: 'USD'
    }
  })

  return response[0]
}
