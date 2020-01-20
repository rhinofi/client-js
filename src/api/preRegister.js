const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkPublicKey) => {
  const ethAddress = dvf.get('account')
  const assertionError = await validateAssertions({
    dvf,
    starkPublicKey
  })
  if (assertionError) {
    return assertionError
  }

  const url = dvf.config.api + '/v1/trading/w/preRegister'
  const data = {
    starkKey: starkPublicKey.x,
    ethAddress
  }
  return post(url, { json: data })
}
