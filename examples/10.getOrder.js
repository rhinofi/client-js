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
  // Using staging API.
  api: 'https://api.stg.deversifi.com'
}


;(async () => {
  const dvf = await DVF(web3, dvfConfig)

  let orderId
  const orders = await dvf.getOrders('ETH:USDT')

  console.log('orders', orders)

  if (orders.length == 0) {
    console.log('submitting new order')

    // Submit an order to buy 150 ZRX for ETH at 0.07 ETH for 1 ZRX
    const symbol = 'ZRX:ETH'
    const amount = 150
    const price = 0.07
    const validFor = '0'
    const feeRate = ''

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
    orderId = submitOrderResponse.orderId
  }
  else {
    orderId = orders[0]._id
  }

  console.log('fetching orderId', orderId)

  const response = await dvf.getOrder(orderId)

  console.log("getOrder response ->", response)

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

