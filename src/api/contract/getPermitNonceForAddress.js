const permitTokenAbi = require('./abi/MintablePermitERC20.abi')
/**
 * Gets token permission nonce for owner
 */
module.exports = (dvf, tokenAddress, ownerAddress) =>
  dvf.eth.call(
    permitTokenAbi,
    tokenAddress,
    'nonces',
    [ownerAddress]
  )
