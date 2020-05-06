const DVF = require('../../src/dvf')
const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')

const register = async ({INFURA_PROJECT_ID, account}, bypassRegister = false) => {
  try {
    console.log("generating dvf")

    const infuraURL = `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`
    const provider = new HDWalletProvider(account.privateKey, infuraURL)
    const web3 = new Web3(provider)
    const dvfConfig = {
      api: 'https://api.stg.deversifi.com'
    }
    const dvf = await DVF(web3, dvfConfig)

    if (bypassRegister) {
      return dvf
    }

    const keyPair = await dvf.stark.createKeyPair(account.privateKey)

    console.log("registering account")
    const registerResponse = await dvf.register(keyPair.starkPublicKey)

    console.log('register response ->', registerResponse)

    return dvf
  } catch (err) {
    console.error('error on register', err.message)
  }
}

exports.register = register