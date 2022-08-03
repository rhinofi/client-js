#!/usr/bin/env node

const getWeb3 = require('./helpers/getWeb3')
const DVF = require('../src/dvf')

const privateKey = '8F085...' // Account's private key
const rpcUrl = 'https://mainnet.infura.io/v3/9e28b...'

const starkPrivKey = privateKey

const { web3, provider } = getWeb3(privateKey, rpcUrl)

const dvfConfig = {
  // Using staging API.
  api: 'https://api.stg.deversifi.com'
}

;(async () => {
  const dvf = await DVF(web3, dvfConfig)

  // Submit an order to sell 0.3 Eth for 200 USDT per 1 Eth
  const symbol = 'ETH:USDT'
  const amount = -0.3
  const price = 200
  const validFor = '0'
  const feeRate = ''

  const submitOrderResponse = await dvf.submitOrder({

    symbol,
    amount,
    price,
    starkPrivateKey: starkPrivKey,
    validFor, // Optional
    feeRate, // Optional
    gid: '1', // Optional
    cid: '1', // Optional
    partnerId: 'P1' // Optional
  })

  console.log('submitOrder response ->', submitOrderResponse)
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
