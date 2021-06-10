const DVFError = require('../DVFError')

module.exports = (tokenInfo, chain) => {
  const tokenAddress = tokenInfo.tokenAddressPerChain[chain]
  // Token unsupported for that chain if not defined
  if (!tokenAddress) {
    throw new DVFError('Unsupported token for chain', {tokenInfo, chain})
  // ETH for ETHEREUM, MATIC for Polygon/Matic...
  // 'native' case kept for retro-compatibility / potential revert cases but means the same thing
  } else if (tokenAddress === 'native' || tokenAddress === '0x0000000000000000000000000000000000000000') {
    return undefined
  }
  // Standard ERC20 address
  return tokenAddress
}
