#!/usr/bin/env -S yarn node
/* eslint-disable no-unused-vars */

/*
DO NOT EDIT THIS FILE BY HAND!
Examples are generated using helpers/buildExamples.js script.
Check README.md for more details.
*/

const sw = require('@rhino.fi/starkware-crypto')
const getWeb3 = require('./helpers/getWeb3')

const RhinofiClientFactory = require('../src')
const envVars = require('./helpers/loadFromEnvOrConfig')(
  process.env.CONFIG_FILE_NAME
)
const logExampleResult = require('./helpers/logExampleResult')(__filename)

const ethPrivKey = envVars.ETH_PRIVATE_KEY
// NOTE: you can also generate a new key using:`
// const starkPrivKey = rhinofi.stark.createPrivateKey()
const starkPrivKey = envVars.STARK_PRIVATE_KEY
const rpcUrl = envVars.RPC_URL

const { web3, provider } = getWeb3(ethPrivKey, rpcUrl)

const rhinofiConfig = {
  api: envVars.API_URL,
  dataApi: envVars.DATA_API_URL,
  useAuthHeader: true,
  wallet: {
    type: 'tradingKey',
    meta: {
      starkPrivateKey: starkPrivKey
    }
  }
  // Add more variables to override default values
}

;(async () => {
  const rhinofi = await RhinofiClientFactory(web3, rhinofiConfig)

  const getPriceFromOrderBook = require('./helpers/getPriceFromOrderBook')

  // Submit an order to sell 0.1 Eth for USDT
  const symbol = 'ETH:USDT'
  const amount = -0.1
  const validFor = '0'
  const feeRate = ''

  // Gets the price from the order book api and cuts 5% to make sure the order will be settled
  const tickersData = await rhinofi.getTickers('ETH:USDT');
  const orderBookPrice = getPriceFromOrderBook(tickersData);
  const price = orderBookPrice - orderBookPrice * 0.05;

  const submitOrderResponse = await rhinofi.submitOrder({
    symbol,
    amount,
    price,
    starkPrivateKey: starkPrivKey,
    validFor,           // Optional
    feeRate,            // Optional
    gid: '1',           // Optional
    cid: 'mycid-' + Math.random().toString(36).substring(7), // Optional
    partnerId: 'P1'    // Optional
  })

  logExampleResult(submitOrderResponse)

})()
.catch(error => {
  console.error(error)
  process.exit(1)
})
