const DVFError = require('../lib/dvf/DVFError')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, starkKey) => {
  validateAssertions(dvf, { token })

  const { status, transactionHash } = await dvf.contract.withdraw(token, starkKey)

  if (!status) {
    throw new DVFError('ERR_ONCHAIN_WITHDRAW')
  }
  return { transactionHash }
}
