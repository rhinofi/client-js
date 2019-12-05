// check truffle-hdwallet-provider on github for more information
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("Web3")

// Please check ../test/index.js for all examples and tests
const EFX = require('..')

const privateKey = '' // Account's private key
const infuraKey = ''  // Your Infura API KEY
const infuraURL = 'https://mainnet.infura.io/v3/' + infuraKey

work = async () => {

  const provider = new HDWalletProvider(privateKey, infuraURL)
  const web3 = new Web3(provider)

  efx = await EFX(web3)

  console.log("")

  // submit an order to SELL 0.01 ETH for 300 USD
  console.log("efx.submitOrder('ETHUSD', -0.1, 300)")

  const response = await efx.submitOrder('ETHUSD', -0.1, 300)

  if(response.length){
    console.log(` - Submitted Order: #${response[0]}`)
  } else {
    console.log("Error:")
    console.log(response)
  }

}

work()

