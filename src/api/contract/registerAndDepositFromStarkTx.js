const errorReasons = require('../../lib/dvf/errorReasons')
const sendToDVFInterface = require('./sendToDVFInterface')
const { fromQuantizedToBaseUnitsBN } = require('dvf-utils')

module.exports = async (dvf, deFiSignature, { starkKey, tokenId, vaultId, amount, tokenAddress, quantum }, options) => {
  const ethTokenInfo = dvf.token.getTokenInfoOrThrow('ETH')
  if (ethTokenInfo.starkTokenId === tokenId) {
    action = 'registerAndDepositEth'
  } else {
    action = 'registerAndDeposit'
  }

  const methodArgs = [starkKey, deFiSignature, tokenId, vaultId]

  const [args, value] = tokenId === ethTokenInfo.starkTokenId
    // For ETH, we convert amount to WEI and add as extra send arg
    ? [methodArgs, fromQuantizedToBaseUnitsBN(ethTokenInfo, amount).toString()]
    // For other tokens, use amount as is (should be quantised), and add to
    // method args.
    : [methodArgs.concat(amount.toString(), tokenAddress, quantum)]

  return sendToDVFInterface(dvf)(action)(args, value, options)
}
