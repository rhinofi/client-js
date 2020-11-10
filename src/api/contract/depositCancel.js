const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, vaultId, token, tradingKey) => {
  const args = [dvf.token.getTokenInfo(token).starkTokenId, vaultId]
  tradingKey = tradingKey || dvf.config.starkKeyHex

  if (dvf.config.starkExUseV2) {
    args.unshift(tradingKey)
  }

  const action = 'depositCancel'

  try {
    return dvf.eth.send(
      dvf.contract.abi.getStarkEx(),
      dvf.config.DVF.starkExContractAddress,
      action,
      args
    )
  } catch (e) {
    console.log(e)
    throw new DVFError('ERR_DEPOSIT_CANCEL')
  }
}
