const DVFError = require('../lib/dvf/DVFError')
const validateAssertions = require('../lib/validators/validateAssertions')

const mockGasPrice = require('./test/fixtures/getSafeGasPrice')
module.exports = async (dvf, token) => {
  validateAssertions(dvf, { token })

  const { status, transactionHash } = await dvf.contract.withdraw(token)

  if (!status) {
    throw new DVFError('ERR_ONCHAIN_WITHDRAW')
  }
  return { transactionHash }
}
