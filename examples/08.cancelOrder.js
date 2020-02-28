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

  let orderId
  const orders = await dvf.getOrders('ETH:USDT')

  console.log('orders', orders)

  if (orders.length == 0) {
    console.log('submitting new order')

    const submitedOrderResponse = await dvf.submitOrder(
      'ETH:USDT', // symbol
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

    console.log('submitedOrderResponse', submitedOrderResponse)
    orderId = submitedOrderResponse.orderId
  }
  else {
    orderId = orders[0]._id
  }

  console.log('cancelling orderId', orderId)

  const response = await dvf.cancelOrder(orderId)

  console.log("cancelOrder response ->", response)

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

