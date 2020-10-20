const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, vaultId, token, starkKey) => {
  const args = [dvf.token.getTokenInfo(token).starkTokenId, vaultId]

  starkKey = starkKey || dvf.config.starkKeyHex

  if (dvf.config.starkExUseV2) {
    args.unshift(starkKey)
  }

  const action = 'depositReclaim'

  try {
    return dvf.eth.send(
      dvf.contract.abi.getStarkEx(),
      dvf.config.DVF.starkExContractAddress,
      action,
      args
    )
  } catch (e) {
    console.log(e)
    throw new DVFError('ERR_DEPOSIT_RECLAIM')
  }
}
