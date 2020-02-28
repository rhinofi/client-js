/**
 * Requests candle from Bitfinex.
 */
const {get} = require('request-promise')

// TODO: move address to either /r/get/conf or to ENV variables
const BFX_API = 'https://api.bitfinex.com/v2/'

module.exports = async (token, timestamp, timeframe) => {
  const symbol = `t${token}USD`

  let url = ''
  url += `${BFX_API}candles/trade:${timeframe}:${symbol}`
  url += `/hist?limit=1&end=${timestamp}`

  candle = await get(url, {json: true})

  // ~ candle data
  // const date = new Date(candle[0][0])
  // console.log("date ->", date)

  candle = candle[0]

  return candle
}
