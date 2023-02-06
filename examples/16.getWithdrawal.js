#!/usr/bin/env -S yarn node
/* eslint-disable no-unused-vars */

/*
DO NOT EDIT THIS FILE BY HAND!
Examples are generated using helpers/buildExamples.js script.
Check README.md for more details.
*/

const sw = require('@rhino.fi/starkware-crypto')
const getWeb3 = require('./helpers/getWeb3')

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

const { web3, provider } = getWeb3(ethPrivKey, rpcUrl)

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

  let withdrawalId
  const withdrawals = await dvf.getWithdrawals(undefined, dvf.get('account'))

  if (withdrawals.length === 0) {
    console.log('creating a new withdrawal')

    const token = 'ETH'
    const amount = 0.1

    const withdrawalResponse = await dvf.transferAndWithdraw({
      recipientEthAddress: dvf.get('account'),
      token,
      amount
    })

    console.log('withdrawalResponse', withdrawalResponse)
    withdrawalId = withdrawalResponse._id
  }
  else {
    withdrawalId = withdrawals[0]._id
  }

  const getWithdrawalResponse = await dvf.getWithdrawal(withdrawalId)

  logExampleResult(getWithdrawalResponse)

})()
.catch(error => {
  console.error(error)
  process.exit(1)
})
