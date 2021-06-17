const DVFError = require('./DVFError')

module.exports = (dvf, chain) => {
  const bridgeContractAddress = dvf.config.DVF.bridgedDepositContractsPerChain[chain]
  if (!bridgeContractAddress) {
    throw new DVFError('NO_BRIDGE_CONTRACT_FOR_CHAIN', { chain })
  }
  return bridgeContractAddress
}
