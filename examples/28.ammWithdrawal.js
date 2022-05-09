#!/usr/bin/env node

/*
DO NOT EDIT THIS FILE BY HAND!
Examples are generated using helpers/buildExamples.js script.
Check README.md for more details.
*/

const HDWalletProvider = require('@truffle/hdwallet-provider')
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
const starkPrivKey = envVars.STARK_PRIVATE_KEY
const rpcUrl = envVars.RPC_URL

const provider = new HDWalletProvider(ethPrivKey, rpcUrl)
const web3 = new Web3(provider)
provider.engine.stop()

const dvfConfig = {
  api: envVars.API_URL,
  dataApi: envVars.DATA_API_URL,
  useAuthHeader: true
  // Add more variables to override default values
}

;(async () => {
  const dvf = await DVF(web3, dvfConfig)

  const waitForDepositCreditedOnChain = require('./helpers/waitForDepositCreditedOnChain')

  const token1 = 'ETH'
  const token2 = 'USDT'

  if (process.env.DEPOSIT_FIRST === 'true') {
    const depositETHResponse = await dvf.deposit(token1, 0.1, starkPrivKey)
    const depositUSDTResponse = await dvf.deposit(token2, 1000, starkPrivKey)

    if (process.env.WAIT_FOR_DEPOSIT_READY === 'true') {
      await waitForDepositCreditedOnChain(dvf, depositETHResponse)
      await waitForDepositCreditedOnChain(dvf, depositUSDTResponse)
    }
  }

  const pool = `${token1}${token2}`

  const ammDepositOrderData = await dvf.getAmmFundingOrderData({
    pool,
    token: token1,
    amount: 0.1
  })

  let ammDeposit = await dvf.postAmmFundingOrder(
    ammDepositOrderData
  )

  await P.retry(
    { times: 360, interval: 1000 },
    async () => {
      ammDeposit = await dvf.getAmmFunding(ammDeposit._id)
      if (ammDeposit.pending) {
        throw new Error('funding order for amm deposit still pending')
      }
    }
  )

  const { BN } = Web3.utils

  const ammWithdrawalOrderData = await dvf.getAmmFundingOrderData({
    pool,
    token: `LP-${pool}`,
    // Withdraw previously deposited liquidity by returning all LP tokens.
    amount: ammDeposit.orders.reduce(
      (sum, order) => sum.add(new BN(order.amountBuy)),
      new BN(0)
    )
  })

  const ammWithdrawal = await dvf.postAmmFundingOrder(
    await dvf.applyFundingOrderDataSlippage(ammWithdrawalOrderData, 0.05)
  )

  logExampleResult(ammWithdrawal)

})()
.catch(error => {
  console.error(error)
  process.exit(1)
})

