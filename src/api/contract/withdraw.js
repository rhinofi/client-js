const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, token, tradingKey) => {
  const { starkTokenId } = dvf.token.getTokenInfo(token)
  tradingKey = tradingKey || dvf.config.starkKeyHex

  const args = [tradingKey, starkTokenId]

  const action = 'withdraw'

  try {
    return dvf.eth.send(
      dvf.contract.abi.getStarkEx(),
      dvf.config.DVF.starkExContractAddress,
      action,
      args
    )
  } catch (e) {
    console.log(e)
    throw new DVFError('ERR_ONCHAIN_WITHDRAW')
  }
}
