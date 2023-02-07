#!/usr/bin/env -S yarn node

const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')

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

const provider = new HDWalletProvider(ethPrivKey, rpcUrl)
const web3 = new Web3(provider)
provider.engine.stop()

const rhinofiConfig = {
  api: envVars.API_URL,
  dataApi: envVars.DATA_API_URL
  // Add more variables to override default values
}

;(async () => {
  const rhinofi = await RhinofiClientFactory(web3, rhinofiConfig)

  const publicPermissionsDescriptor = await rhinofi.publicUserPermissions()

  logExampleResult(publicPermissionsDescriptor)

  // Get currently set permissions for a user, authenticated endpoint
  const currentUerPermissions = await rhinofi.account.getPermissions()
  logExampleResult(currentUerPermissions)

  // Enable all of the permissions
  Object.keys(currentUerPermissions).map(async (permissionKey) => {
    const updatedPermissions = await rhinofi.account.setPermissions({ key: permissionKey, value: true })
    logExampleResult(updatedPermissions)
  })
})()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
