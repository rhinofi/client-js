#!/usr/bin/env node

/*
 TESTING ONLY
 DO NOT MERGE THIS FILE INTO THE MAIN PIPELINE
*/

const HDWalletProvider = require('@truffle/hdwallet-provider')
const sw = require('starkware_crypto')
const Web3 = require('web3')
const P = require('aigle')

const DVF = require('../src/dvf')
const envVars = require('./helpers/loadFromEnvOrConfig')(
  process.env.CONFIG_FILE_NAME
)
const logExampleResult = require('./helpers/logExampleResult')(__filename)

const ethPrivKey = envVars.ETH_PRIVATE_KEY
// NOTE: you can also generate a new key using:`
// const starkPrivKey = dvf.stark.createPrivateKey()
const starkPrivKey = envVars.STARK_PRIVATE_KEY
const rpcUrl = envVars.RPC_URL

const provider = new HDWalletProvider(ethPrivKey, rpcUrl)
const web3 = new Web3(provider)
provider.engine.stop()

const dvfConfig = {
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
  const dvf = await DVF(web3, dvfConfig)

  dvf.config.useAuthHeader = true

  const waitForDepositCreditedOnChain = require('./helpers/waitForDepositCreditedOnChain')

  const token1 = 'KON'
  const token2 = 'DVF'

  const totalAmountToken1 = 100
  const totalAmountToken2 = 100
  if (process.env.DEPOSIT_FIRST === 'true') {
    const depositToken1Response = await dvf.deposit(token1, totalAmountToken1, starkPrivKey)
    const depositToken2Response = await dvf.deposit(token2, totalAmountToken2, starkPrivKey)

    if (process.env.WAIT_FOR_DEPOSIT_READY === 'true') {
      await waitForDepositCreditedOnChain(dvf, depositToken1Response)
      await waitForDepositCreditedOnChain(dvf, depositToken2Response)
    }
  }

  const pool = `${token1}${token2}`
  const totalOrders = 10
  const waitTimeMs = 5000

  // Amm deposit consist of 2 orders, one for each of the pool tokens.
  // The tokens need to be supplied in a specific ratio. This call fetches
  // order data from Deversifi API, given one of the tokens and desired deposit
  // amount for that token.
  const getFundingData = async () => {
    const fundingData = await dvf.getAmmFundingOrderData({
      pool,
      token: token1,
      amount: (totalAmountToken1 / totalOrders).toFixed(4) // 4 decimal places support
    })

    return dvf.applyFundingOrderDataSlippage(fundingData, 0.05)
  }

  const fundingData = await getFundingData()

  await P.timesSeries(totalOrders, async (i) => {
    console.log(`[${i}] Submitting order...`)
    await dvf.postAmmFundingOrders(fundingData)
    console.log(`[${i}] Submitted order`)

    await P.delay(waitTimeMs)
  })
})()
.catch(error => {
  console.error(error)
  process.exit(1)
})

