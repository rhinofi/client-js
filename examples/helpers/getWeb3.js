const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')

module.exports = (ethPrivKey, rpcUrl) => {
  const provider = new HDWalletProvider({
    privateKeys: [ethPrivKey],
    providerOrUrl: rpcUrl
  })

  const web3 = new Web3(provider)
  provider.engine.stop()

  return { web3, provider }
}
