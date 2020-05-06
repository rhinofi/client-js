#!/usr/bin/env node

const HDWalletProvider = require('truffle-hdwallet-provider')
const sw = require('starkware_crypto')
const Web3 = require('web3')

const DVF = require('../src/dvf')
const envVars = require('./helpers/loadFromEnvOrConfig')()


const ethPrivKey = envVars.ETH_PRIVATE_KEY
// NOTE: you can also generate a new key using:`
// const starkPrivKey = dvf.stark.createPrivateKey()
const starkPrivKey = ethPrivKey
const infuraURL = `https://ropsten.infura.io/v3/${envVars.INFURA_PROJECT_ID}`

const provider = new HDWalletProvider(ethPrivKey, infuraURL)
const web3 = new Web3(provider)

const dvfConfig = {
  // Using staging API.
  api: 'https://api.stg.deversifi.com'
}


;(async () => {
  const dvf = await DVF(web3, dvfConfig)

  const path = `44'/60'/0'/0'/0`
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
  provider.engine.stop()
})
.catch(error => {
  console.error(error)
  process.exit(1)
})

