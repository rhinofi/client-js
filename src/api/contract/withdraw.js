const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, token, starkKey) => {
  const { starkTokenId } = dvf.token.getTokenInfo(token)

  const args = [starkTokenId]

  if (dvf.config.starkExUseV2) {
    args.unshift(starkKey)
  }

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
