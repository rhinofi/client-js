const DVFError = require('../lib/dvf/DVFError')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, address) => {
  validateAssertions(dvf, { token })

  if (!address) {
    address = dvf.config.starkKeyHex
  }

  try {
    const withdrawal = await dvf.contract.withdraw(token, address)
    return { transactionHash: withdrawal.transactionHash }
  } catch (error) {
    throw new DVFError('ERR_ONCHAIN_WITHDRAW')
  }
}
