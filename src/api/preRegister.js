const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkPublicKey) => {
  const ethAddress = dvf.get('account')
  validateAssertions(dvf, { starkPublicKey })

  const url = dvf.config.api + '/v1/trading/w/preRegister'
  const data = {
    starkKey: starkPublicKey.x,
    ethAddress
  }

  return post(url, { json: data })
}
