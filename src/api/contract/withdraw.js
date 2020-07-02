const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, token, txMeta) => {
  const { starkTokenId } = dvf.token.getTokenInfo(token)

  const args = [starkTokenId]

  const action = 'withdraw'

  try {
    return dvf.eth.send(
      dvf.contract.abi.StarkEx,
      dvf.config.DVF.starkExContractAddress,
      action,
      args,
      null,
      txMeta
    )
  } catch (e) {
    console.log(e)
    throw new DVFError('ERR_ONCHAIN_WITHDRAW')
  }
}
