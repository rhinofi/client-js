const DVF = require('../src/dvf')
const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')

const register = async account => {
  try {
    const ethPrivKey = account.ETH_PRIVATE_KEY

    const infuraURL = `https://ropsten.infura.io/v3/${account.INFURA_PROJECT_ID}`

    const provider = new HDWalletProvider(ethPrivKey, infuraURL)
    const web3 = new Web3(provider)

    const dvfConfig = {
      api: 'https://api.deversifi.dev'
    }

    const dvf = await DVF(web3, dvfConfig)

    return dvf
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

exports.register = register
