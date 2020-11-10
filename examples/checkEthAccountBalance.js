#!/usr/bin/env node
const Web3 = require('web3')

const getBalanceInEth = async (web3, account) => web3.utils.fromWei(
  await web3.eth.getBalance(account.address),
  'ether'
)

const envVars = require('./helpers/loadFromEnvOrConfig')(
  process.env.CONFIG_FILE_NAME
)

const web3 = new Web3(new Web3.providers.HttpProvider(
  `https://ropsten.infura.io/v3/${envVars.INFURA_PROJECT_ID}`
))

const ethPrivKey = envVars.ETH_PRIVATE_KEY
const account = web3.eth.accounts.privateKeyToAccount(ethPrivKey)

getBalanceInEth(web3, account).then(console.log)
