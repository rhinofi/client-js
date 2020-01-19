const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token) => {
  const assertionError = await validateAssertions({ dvf, token })
  if (assertionError) return assertionError

  const nonce = Date.now() / 1000 + 30 + ''
  const signature = await dvf.sign(nonce.toString(16))
  const data = {
    nonce,
    signature,
    token
  }

  // console.log('data is ', data)
  const url = dvf.config.api + '/v1/trading/r/getBalance'
  return post(url, { json: data })
}
