const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, token) => {
  const { starkVaultId } = dvf.token.getTokenInfo(token)

  const args = [starkVaultId]

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
