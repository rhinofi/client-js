const getCandle = require('./getCandle')

/**
 * We will always return 1 USD for stable coins
 */
const stableCoins = require('./stableCoins')

module.exports = async (token, timeframe, timestamp ) => {
  if (stableCoins[token]) {
    return stableCoins[token]
  }

  timestamp = timestamp || Date.now()
  timeframe = timeframe || '1h'

  const candle = await getCandle(token, timestamp, timeframe)

  // return the open price for the 1 Hour candle
  return candle[2]
}