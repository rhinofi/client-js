#!/usr/bin/env node

const HDWalletProvider = require('truffle-hdwallet-provider')
const sw = require('starkware_crypto')
const Web3 = require('web3')

const DVF = require('../src/dvf')
const envVars = require('./helpers/loadFromEnvOrConfig')()
const getPriceFromOrderBook = require('./helpers/getPriceFromOrderBook')

const ethPrivKey = envVars.ETH_PRIVATE_KEY
// NOTE: you can also generate a new key using:`
// const starkPrivKey = dvf.stark.createPrivateKey()
const starkPrivKey = ethPrivKey
const infuraURL = `https://ropsten.infura.io/v3/${envVars.INFURA_PROJECT_ID}`

const provider = new HDWalletProvider(ethPrivKey, infuraURL)
const web3 = new Web3(provider)
provider.engine.stop()

const dvfConfig = {
  // Using staging API.
  api: 'https://api.stg.deversifi.com'
  // Add more variables to override default values
}

;(async () => {
  const dvf = await DVF(web3, dvfConfig)

  // Submit an order to sell 0.3 Eth for 200 USDT per 1 Eth
  const symbol = 'ETH:USDT'
  const amount = -0.3
  const validFor = '0'
  const feeRate = ''

  // Gets the price from the order book api and cuts 5% to make sure the order will be settled
  const orderBookPrice = await getPriceFromOrderBook();
  const price = orderBookPrice - orderBookPrice * 0.05;

  const submitOrderResponse = await dvf.submitOrder({
    symbol,
    amount,
    price,
    starkPrivateKey: starkPrivKey,
    validFor,           // Optional
    feeRate,            // Optional
    gid: '1',           // Optional
    cid: '1',           // Optional
    partnerId: 'P1'    // Optional
  })

  console.log('submitOrder response ->', submitOrderResponse)

})()
.catch(error => {
  console.error(error)
  process.exit(1)
})

