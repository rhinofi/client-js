const DVFError = require('../lib/dvf/DVFError')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, txMeta) => {
  validateAssertions(dvf, { token })

  const { status, transactionHash } = await dvf.contract.withdraw(token, txMeta)

  if (!status) {
    throw new DVFError('ERR_ONCHAIN_WITHDRAW')
  }
  return { transactionHash }
}
