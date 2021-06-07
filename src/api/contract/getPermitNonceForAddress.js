const permitTokenAbi = require('./abi/MintablePermitERC20.abi')
/**
 * Gets token permission nonce for owner
 */
module.exports = (dvf, tokenAddress, ownerAddress) => {
  const args = [
    ownerAddress
  ]

  const action = 'nonces'

  return dvf.eth.call(
    permitTokenAbi,
    tokenAddress,
    action,
    args
  )
}
