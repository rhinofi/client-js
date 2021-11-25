// TODO: this file contains very similar logic to ./deposit, so one could be
// implemented in terms of the other once the TODO in the latter is resolved.
const sendToStarkExContract = require('./sendToStarkExContract')

const { fromQuantizedToBaseUnitsBN } = require('dvf-utils')

module.exports = (dvf, { starkKey, tokenId, vaultId, amount }, options) => {
  const ethTokenInfo = dvf.token.getTokenInfoOrThrow('ETH')

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
    : [methodArgs.concat(amount.toString())]

  return sendToStarkExContract(dvf)('deposit')(args, value, options)
}
