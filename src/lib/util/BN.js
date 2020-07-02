const BigNumber = require('bignumber.js')

BigNumber.config({
  DECIMAL_PLACES: 50,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP
})

module.exports = BigNumber
