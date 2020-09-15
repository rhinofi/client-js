#!/usr/bin/env node

const HDWalletProvider = require('truffle-hdwallet-provider')
const sw = require('starkware_crypto')
const Web3 = require('web3')

const DVF = require('../src/dvf')
const envVars = require('./helpers/loadFromEnvOrConfig')(
  process.env.CONFIG_FILE_NAME
)
const logExampleResult = require('./helpers/logExampleResult')(__filename)

const ethPrivKey = envVars.ETH_PRIVATE_KEY
// NOTE: you can also generate a new key using:`
// const starkPrivKey = dvf.stark.createPrivateKey()
const starkPrivKey = ethPrivKey
const infuraURL = `https://ropsten.infura.io/v3/${envVars.INFURA_PROJECT_ID}`

const provider = new HDWalletProvider(ethPrivKey, infuraURL)
const web3 = new Web3(provider)
provider.engine.stop()

const dvfConfig = {
  api: envVars.API_URL,
  dataApi: envVars.DATA_API_URL
  // Add more variables to override default values
}

;(async () => {
  const dvf = await DVF(web3, dvfConfig)

  const P = require('aigle')
  let orderId
  const orders = await dvf.getOrders()

  console.log('orders', orders)

  if (orders.length == 0) {
    console.log('submitting new order')

    // Submit an order to sell 0.1 ETH at a the price of 5000 USDT per ETH
    const symbol = 'ETH:USDT'
    const amount = -0.1
    const price = 5000
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

    orderId = submitOrderResponse._id

    while (true) {
      console.log('checking if order appears on the book...')
      if ((await dvf.getOrders()).find(o => o._id === orderId)) break
      await P.delay(1000)
    }
  }
  else {
    orderId = orders[0]._id
  }

  console.log('cancelling orderId', orderId)

  const response = await dvf.cancelOrder(orderId)

  logExampleResult(response)

})()
.catch(error => {
  console.error(error)
  process.exit(1)
})

