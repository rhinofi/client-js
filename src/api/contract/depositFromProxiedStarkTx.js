// TODO: this file contains very similar logic to ./deposit, so one could be
// implemented in terms of the other once the TODO in the latter is resolved.
const sendToDVFInterface = require('./sendToDVFInterface')

const { fromQuantizedToBaseUnitsBN } = require('dvf-utils')

module.exports = (dvf, { starkKey, tokenId, vaultId, amount, tokenAddress, quantum }, options) => {
  const ethTokenInfo = dvf.token.getTokenInfoOrThrow('ETH')
  let action

  if (ethTokenInfo.starkTokenId === tokenId) {
    action = 'depositEth'
  } else {
    action = 'deposit'
  }

  // This should never happen.
  if (!ethTokenInfo.starkTokenId) {
    throw new Error('ethTokenInfo.starkTokenId not defined')
  }

  const methodArgs = [starkKey, tokenId, vaultId]
  const [args, value] = tokenId === ethTokenInfo.starkTokenId
    // For ETH, we convert amount to WEI and add as extra send arg
    ? [methodArgs, fromQuantizedToBaseUnitsBN(ethTokenInfo, amount).toString()]
    // For other tokens, use amount as is (should be quantised), and add to
    // method args.
    : [methodArgs.concat(amount.toString(), tokenAddress, quantum)]

  return sendToDVFInterface(dvf)(action)(args, value, options)
}
