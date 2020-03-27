#!/usr/bin/env node

const DVF = require('../src/dvf')
const envVars = require('./helpers/loadFromEnvOrConfig')()
const Web3 = require('web3')
const createLedgerSubprovider = require('@ledgerhq/web3-subprovider').default
const TransportU2F = require('@ledgerhq/hw-transport-node-hid').default
const ProviderEngine = require('web3-provider-engine')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc')
const engine = new ProviderEngine()
const getTransport = () => TransportU2F.create()
const ledger = createLedgerSubprovider(getTransport, {
  accountsLength: 1
})
engine.addProvider(ledger)
engine.addProvider(
  new RpcSubprovider({
    rpcUrl: 'https://ropsten.infura.io/v3/7bfab7398ae84af3b1b70c955cfd9491'
  })
)
engine.start()
const web3 = new Web3(engine)

const dvfConfig = {
  // Using dev API.
  api: 'https://api.deversifi.dev'
}

;(async () => {
  const dvf = await DVF(web3, dvfConfig)
  const path = `21323'/0`
  const token = 'ETH'
  const amount = 0.95

  const starkDepositData = await dvf.stark.ledger.createDepositData(
    path,
    token,
    amount
  )

  const depositResponse = await dvf.ledger.deposit(
    token,
    amount,
    starkDepositData
  )

  console.log('deposit response ->', 'depositResponse')
})()
  // Stop provider to allow process to exit.
  .then(() => {
    console.log('Stopping provider...')
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
