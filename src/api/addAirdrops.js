const post = require('../lib/dvf/post-authenticated')
const validateProps = require('../lib/validators/validateProps')
const { each } = require('lodash')

module.exports = async (dvf, airdrops, nonce, signature) => {
  each(airdrops, (airdrop) => {
    validateProps(dvf, ['token', 'amount', 'user'], airdrop)
  })

  return post(
    dvf,
    '/v1/trading/r/addAirdrops',
    nonce,
    signature,
    { airdrops }
  )
}
