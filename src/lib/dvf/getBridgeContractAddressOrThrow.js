const DVFError = require('./DVFError')

module.exports = (dvf, chain) => {
  const bridgeContractAddress = dvf.config.DVF.bridgedDepositContractsPerChain
    // Legacy location of contract address
    ? dvf.config.DVF.bridgedDepositContractsPerChain[chain]
    // Future/new location of contract address
    : dvf.config.DVF.bridgeConfigPerChain[chain] && dvf.config.DVF.bridgeConfigPerChain[chain].contractAddress
  if (!bridgeContractAddress) {
    throw new DVFError('NO_BRIDGE_CONTRACT_FOR_CHAIN', { chain })
  }
  return bridgeContractAddress
}
