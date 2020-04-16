#!/usr/bin/env node

const HDWalletProvider = require('truffle-hdwallet-provider')
const sw = require('starkware_crypto')
const Web3 = require('web3')

const DVF = require('../src/dvf')
const envVars = require('./helpers/loadFromEnvOrConfig')()


const ethPrivKey = envVars.ETH_PRIVATE_KEY
// NOTE: you can also generate a new key using:`
// const starkPrivKey = dvf.stark.createPrivateKey()
const starkPrivKey = ethPrivKey
const infuraURL = `https://ropsten.infura.io/v3/${envVars.INFURA_PROJECT_ID}`

const provider = new HDWalletProvider(ethPrivKey, infuraURL)
const web3 = new Web3(provider)

const dvfConfig = {
  // Using dev API.
  api: 'https://api.deversifi.dev'
}


;(async () => {
  const dvf = await DVF(web3, dvfConfig)

  let orders = await dvf.getOrders('ETH:BTC')

  if (orders.length == 0) {

    console.log('no orders for ETH:BTC, submitting one')

    const submitedOrderResponse = await dvf.submitOrder(
      'ETH:BTC', // symbol
      -0.3, // amount
      500, // price
      '', // gid
      '', // cid
      '0', // signedOrder
      0, // validFor
      'P1', // partnerId
      '', // feeRate
      '', // dynamicFeeRate
      starkPrivKey
    )
  }

  orders = await dvf.getOrders('ETH:BTC')

  console.log("getOrders response ->", orders)

})()
// Stop provider to allow process to exit.
.then(() => {
  console.log('Stopping provider...')
  provider.engine.stop()
})
.catch(error => {
  console.error(error)
  process.exit(1)
})

