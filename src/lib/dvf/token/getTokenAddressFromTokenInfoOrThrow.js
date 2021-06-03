const DVFError = require('../DVFError')

module.exports = (tokenInfo, chain) => {
  const tokenAddress = tokenInfo.tokenAddressPerChain[chain]
  // Token unsupported for that chain if not defined
  if (!tokenAddress) {
    throw new DVFError('Unsupported token for chain', {tokenInfo, chain})
  // ETH for ETHEREUM, MATIC for Polygon/Matic...
  } else if (tokenAddress === 'native') {
    return undefined
  }
  // Standard ERC20 address
  return tokenAddress
}
