const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkKey) => {
  const ethAddress = dvf.get('account')
  const assertionError = await validateAssertions({
    dvf,
    starkKey
  })
  if (assertionError) {
    return assertionError
  }

  const url = dvf.config.api + '/v1/trading/w/preRegister'
  const data = {
    starkKey,
    ethAddress
  }
  return post(url, { json: data })
}
