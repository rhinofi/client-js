const permitTokenAbi = require('./abi/AaveToken.abi')
/**
 * Gets token permission nonce for owner
 * This naming "_nonces" prefixed with underscore
 * is implemented by Aave (https://docs.aave.com/developers/the-core-protocol/aave-token#_nonces)
 * (vs. "nonces" for some other tokens)
 */
module.exports = (dvf, tokenAddress, ownerAddress) =>
  dvf.eth.call(
    permitTokenAbi,
    tokenAddress,
    '_nonces',
    [ownerAddress]
  )
