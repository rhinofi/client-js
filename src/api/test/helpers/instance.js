/**
 * Creats a client instance for testing
 **/
const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')

const DVF = require('../../../dvf')

module.exports = async () => {
  const nodeURL = process.env.NODE_URL
  const privateKey = process.env.PRIVATE_ETH_KEY

  const provider = new HDWalletProvider(privateKey, nodeURL)

  const web3 = new Web3(provider)

  let config = {}

  // It's possible to overwrite the API address with the testnet address
  // for example like this:
  //config.api = 'https://api.deversifi.dev'
  // config.api = 'http://localhost:7777/v1/trading'
  return DVF(web3, config)
}
