const DVFError = require('../lib/dvf/DVFError')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token) => {
  validateAssertions(dvf, { token })

  const { starkKeyHex } = dvf.config
  const { status, transactionHash } = await dvf.contract.fullWithdrawalRequest(token, starkKeyHex)

  if (!status) {
    throw new DVFError('ERR_CALLING_FULL_WITHDRAWAL_REQUEST')
  }
  return { transactionHash }
}
