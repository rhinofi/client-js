const DVF = require('../../src/dvf')
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const register = async ({ RPC_URL, account }, bypassRegister = false, useTradingKey = false) => {
  try {
    console.log('generating dvf')

    const rpcURL = RPC_URL
    const provider = new HDWalletProvider({
      privateKeys: [account.privateKey],
      providerOrUrl: rpcURL
    })

    const web3 = new Web3(provider)
    const dvfConfig = {
      api: 'https://api.deversifi.dev',
      useTradingKey
    }
    const dvf = await DVF(web3, dvfConfig)

    if (bypassRegister) {
      return dvf
    }

    const keyPair = await dvf.stark.createKeyPair(account.privateKey)

    console.log('registering account')
    const registerResponse = await dvf.register(keyPair.starkPublicKey)

    console.log('register response ->', registerResponse)

    return dvf
  } catch (err) {
    console.error('error on register', err.message)
  }
}

module.exports = register
