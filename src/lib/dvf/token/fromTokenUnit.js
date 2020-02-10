const conf = require('../../../dvf-client-config')
const BN = require('bignumber.js')

module.exports = (token, amount) => {
  if (token === 'USDT') {
    token = 'USD'
  }

  return BN(amount).shiftedBy(-1 * conf.tokenRegistry[token].decimals)
}
