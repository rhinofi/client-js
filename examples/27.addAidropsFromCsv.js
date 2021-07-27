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

  const fs = require('fs')
  const { map } = require('lodash/fp')

  const readFromCsv = (path) => {
    const data = fs.readFileSync(path, 'utf8')
    const splitData = data.split(/\r?\n/)
    const airdrops = map(([user, token, amount]) => ({
      user, token, amount
    }))(splitData)

    return airdrops
  }

  const path = process.argv[process.argv.length - 1]
  if (!path) {
    console.error('No CSV file path passed')
    throw new Error('No CSV file')
  }

  const airdrops = readFromCsv(path)

  console.log(`Adding ${airdrops.length} airdrops`)

  const response = await dvf.addAirdrops(airdrops)

  logExampleResult(response)

})()
.catch(error => {
  console.error(error)
  process.exit(1)
})

