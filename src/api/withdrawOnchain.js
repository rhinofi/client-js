const DVFError = require('../lib/dvf/DVFError')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, address) => {
  validateAssertions(dvf, { token })

  if (!address) {
    address = dvf.config.starkKeyHex
  }

  const { status, transactionHash } = await dvf.contract.withdraw(token, address)

  if (!status) {
    throw new DVFError('ERR_ONCHAIN_WITHDRAW')
  }
  return { transactionHash }
}
