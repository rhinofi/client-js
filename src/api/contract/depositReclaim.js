const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, vaultId, token) => {
  const args = [dvf.token.getTokenInfo(token).starkTokenId, vaultId]
  const action = 'depositReclaim'

  try {
    return dvf.eth.send(
      dvf.contract.abi.StarkEx,
      dvf.config.DVF.starkExContractAddress,
      action,
      args
    )
  } catch (e) {
    console.log(e)
    throw new DVFError('ERR_DEPOSIT_RECLAIM')
  }
}
