const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (efx, token) => {
  const assertionError = validateAssertions({efx, token})
  if (assertionError) return assertionError

  const nonce = Date.now() / 1000 + 30 + ''
  const signature = await efx.sign(nonce.toString(16))
  const data = {
    nonce,
    signature,
    token
  }
  // console.log('data is ', data)
  const url = efx.config.api + '/r/getBalance'
  // const url= 'http://localhost:7777/v1/trading/r/getBalance'
  return post(url, { json: data })
}
