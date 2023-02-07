#!/usr/bin/env -S yarn node

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

  const transferResponse = await rhinofi.transfer({
    recipientEthAddress: '0x5317c63f870e8D2f85f0dE3c2666D1414f5a728c',
    token: 'USDT',
    amount: 1
  })

  logExampleResult(transferResponse)
})()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
