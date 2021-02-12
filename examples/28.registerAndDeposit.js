#!/usr/bin/env node

const HDWalletProvider = require('@truffle/hdwallet-provider')
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

  const waitForDepositCreditedOnChain = require('./helpers/waitForDepositCreditedOnChain')

  const keyPair = await dvf.stark.createKeyPair(starkPrivKey)

  const depositResponse = await dvf.registerAndDeposit({ token: 'ETH', amount: 0.1 }, keyPair.starkPublicKey)

  if (process.env.WAIT_FOR_DEPOSIT_READY === 'true') {
    await waitForDepositCreditedOnChain(dvf, depositResponse)
  }

  logExampleResult(depositResponse)
  
})()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
