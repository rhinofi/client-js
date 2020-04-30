const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, vaultId) => {
  const args = [vaultId]
  const action = 'fullWithdrawalRequest'

  try {
    return dvf.eth.send(
      dvf.contract.abi.StarkEx,
      dvf.config.DVF.starkExContractAddress,
      action,
      args
    )
  } catch (e) {
    console.log(e)
    throw new DVFError('ERR_FULL_WITHDRAWAL_REQUEST')
  }
}
