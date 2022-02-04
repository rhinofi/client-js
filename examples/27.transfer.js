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
  },
  apiKey: envVars.API_KEY
  // Add more variables to override default values
}

;(async () => {
  const dvf = await DVF(web3, dvfConfig)

  const transferResponse = await dvf.transfer({
    recipientEthAddress: '0x1A546a36B4D12140285d5A632F9895dBFB629496',
    token: 'USDT',
    amount: 50,
    type: 'tradingKey'
  })

  logExampleResult(transferResponse)
})()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
