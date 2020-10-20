const DVFError = require('../lib/dvf/DVFError')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token) => {
  validateAssertions(dvf, { token })

  const { starkKeyHex } = dvf.config
  const { status, transactionHash } = await dvf.contract.withdraw(token, starkKeyHex)

  if (!status) {
    throw new DVFError('ERR_ONCHAIN_WITHDRAW')
  }
  return { transactionHash }
}
