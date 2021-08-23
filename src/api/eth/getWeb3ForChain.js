const DVFError = require('../../lib/dvf/DVFError')

module.exports = (dvf, chain = 'ETHEREUM') => {
  if (chain === 'ETHEREUM') {
    return dvf.web3
  }
  const web3ForChain = dvf.web3PerChain && dvf.web3PerChain[chain]
  if (!web3ForChain) {
    throw new DVFError('NO_WEB3_FOR_CHAIN', { chain })
  }
  return web3ForChain
}
