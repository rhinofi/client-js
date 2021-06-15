const errorReasons = require('../../lib/dvf/errorReasons')
const sendToDVFInterface = require('./sendToDVFInterface')
const { fromQuantizedToBaseUnitsBN } = require('dvf-utils')
const permitParamsToArgs = require('../../lib/util/permitParamsToArgs')

module.exports = async (dvf, deFiSignature, { starkKey, tokenId, vaultId, amount, tokenAddress, quantum, permitParams = null }, options) => {
  const ethTokenInfo = dvf.token.getTokenInfoOrThrow('ETH')
  let action
  if (ethTokenInfo.starkTokenId === tokenId) {
    action = 'registerAndDepositEth'
  } else if (permitParams) {
    action = 'registerAndDepositWithPermit'
  } else {
    action = 'registerAndDeposit'
  }

  const methodArgs = [starkKey, deFiSignature, tokenId, vaultId]

  const [args, value] = tokenId === ethTokenInfo.starkTokenId
    // For ETH, we convert amount to WEI and add as extra send arg
    ? [methodArgs, fromQuantizedToBaseUnitsBN(ethTokenInfo, amount).toString()]
    // For other tokens, use amount as is (should be quantised), and add to
    // method args.
    : [methodArgs.concat(amount.toString(), tokenAddress, quantum).concat(permitParamsToArgs(permitParams))]

  return sendToDVFInterface(dvf)(action)(args, value, options)
}
