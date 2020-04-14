const DVF = require('../../src/dvf')
const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')

const register = async account => {
  try {
    console.log("generating dvf")

    const ethPrivKey = account.ETH_PRIVATE_KEY
    const infuraURL = `https://ropsten.infura.io/v3/${account.INFURA_PROJECT_ID}`
    const provider = new HDWalletProvider(ethPrivKey, infuraURL)
    const web3 = new Web3(provider)
    const dvfConfig = {
      api: 'https://api.deversifi.dev'
    }
    const dvf = await DVF(web3, dvfConfig)
    const keyPair = await dvf.stark.createKeyPair(ethPrivKey)

    console.log("registering account")
    const registerResponse = await dvf.register(keyPair.starkPublicKey)

    console.log('register response ->', registerResponse)

    return dvf
  } catch (err) {
    console.error('error on register', err.message)
  }
}

exports.register = register