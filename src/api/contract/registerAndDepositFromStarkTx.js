const errorReasons = require('../../lib/dvf/errorReasons')
const sendToDVFInterface = require('./sendToDVFInterface')
const { fromQuantizedToBaseUnitsBN } = require('dvf-utils')

module.exports = async (dvf, deFiSignature, { starkKey, tokenId, vaultId, amount }) => {
  const ethTokenInfo = dvf.token.getTokenInfoOrThrow('ETH')

  if (ethTokenInfo.starkTokenId === tokenId) {
    value = fromQuantizedToBaseUnitsBN(ethTokenInfo, amount).toString()
    action = 'registerAndDepositEth'
  } else {
    value = amount
    action = 'registerAndDeposit'
  }

  console.log('DeFiSignature:', deFiSignature)

  const args = [starkKey, deFiSignature, tokenId, vaultId, value]

  if (ethTokenInfo.starkTokenId === tokenId) {
    args.pop()
    return sendToDVFInterface(dvf)(action)(args, value)
  }

  return sendToDVFInterface(dvf)(action)(args)
}
