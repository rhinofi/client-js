#!/usr/bin/env node

const HDWalletProvider = require('truffle-hdwallet-provider')
const sw = require('starkware_crypto')
const Web3 = require('web3')

const DVF = require('../src/dvf')
const envVars = require('./helpers/loadFromEnvOrConfig')(
  process.env.CONFIG_FILE_NAME
)

const ethPrivKey = envVars.ETH_PRIVATE_KEY
// NOTE: you can also generate a new key using:`
// const starkPrivKey = dvf.stark.createPrivateKey()
const starkPrivKey = ethPrivKey
const infuraURL = `https://ropsten.infura.io/v3/${envVars.INFURA_PROJECT_ID}`

const provider = new HDWalletProvider(ethPrivKey, infuraURL)
const web3 = new Web3(provider)
provider.engine.stop()

const dvfConfig = {
  api: envVars.API_URL
  // Add more variables to override default values
}

;(async () => {
  const dvf = await DVF(web3, dvfConfig)

  let withdrawalId
  const withdrawals = await dvf.getWithdrawals()

  if (withdrawals.length == 0) {
    console.log('creating a new withdrawal')

    const token = 'ETH'
    const amount = 0.1

    const withdrawalResponse = await dvf.withdraw(
      token,
      amount,
      starkPrivKey
    )

    console.log('withdrawalResponse', withdrawalResponse)
    withdrawalId = withdrawalResponse._id
  }
  else {
    withdrawalId = withdrawals[0]._id
  }

  const canceledWithdrawal = await dvf.cancelWithdrawal(withdrawalId)

  console.log('cancelWithdrawal response ->', canceledWithdrawal)

})()
.catch(error => {
  console.error(error)
  process.exit(1)
})

