// check truffle-hdwallet-provider on github for more information
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("Web3")

// Please check ../test/index.js for all examples and tests
const DVF = require('../src/dvf')

const ethPrivKey = '2CEE6684B58FD9EB98B68FA09BBFA206B52DAF31F36FFB833BC5ACF4F35318D6' // Account's private key
const starkPrivKey = '00bc470160426c8f097544a12d8d57e4cdfe24d9018d59ff20bd09542bda93'

const infuraKey = '2b3a2d47a68646a1a53aa85548af48e5'  // Your Infura API KEY
const infuraURL = 'https://ropsten.infura.io/v3/' + infuraKey

const sw = require('starkware_crypto')

work = async () => {

  const provider = new HDWalletProvider(ethPrivKey, infuraURL)
  const web3 = new Web3(provider)

  let config = {}

  // It's possible to overwrite the API address with the testnet address
  // for example like this:
  config.api = 'https://api.deversifi.dev'

  const dvf = await DVF(web3)

  // generate a new private key with:
  // starkPrivKey = dvf.stark.createPrivateKey()

  const keyPair = await dvf.stark.createKeyPair(starkPrivKey)

  // const response = await dvf.preRegister(keyPair.starkPublicKey)
  // response.deFiSignature = '0x1831c85de46ce337c300debf82e87114fef7d23c04bfaca7b2ed292c78c361ec2a2b69a8b7f7751f0531ec6350ccc3f0177ce023404215992b0bf14badf7f8c01c'

  const onChainRegister = await dvf.register(keyPair.starkPublicKey)

  console.log("preRegister ->", onChainRegister)
}

work()

