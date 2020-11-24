const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, token, tradingKey) => {
  const { starkVaultId } = dvf.token.getTokenInfo(token)

  tradingKey = tradingKey || dvf.config.starkKeyHex

  const args = [starkVaultId]

  if (dvf.config.starkExUseV2) {
    args.unshift(tradingKey)
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
