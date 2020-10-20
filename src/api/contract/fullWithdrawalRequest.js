const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, token, starkKey) => {
  const { starkVaultId } = dvf.token.getTokenInfo(token)

  starkKey = starkKey || dvf.config.starkKeyHex

  const args = [starkVaultId]

  if (dvf.config.starkExUseV2) {
    args.unshift(starkKey)
  }

  const action = 'fullWithdrawalRequest'

  try {
    return dvf.eth.send(
      dvf.contract.abi.getStarkEx(),
      dvf.config.DVF.starkExContractAddress,
      action,
      args
    )
  } catch (e) {
    console.log(e)
    throw new DVFError('ERR_FULL_WITHDRAWAL_REQUEST')
  }
}
