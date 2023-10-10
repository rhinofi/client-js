#!/usr/bin/env -S yarn node

/*
1. Creates new Ethereum wallet on the network indicated by RPC_URL
2. Saves the private key and other info in config.json
*/

const fs = require('fs')
const readline = require('readline')
const Web3 = require('web3')
const P = require('@rhino.fi/aigle')
const saveAsJson = require('./helpers/saveAsJson')

const RPC_URL = process.argv[2]
const createNewAccount = process.env.CREATE_NEW_ACCOUNT === 'true'
const useExistingAccount = process.env.USE_EXISTING_ACCOUNT === 'true'
const API_URL = process.env.API_URL || 'https://api.stg.rhino.fi'
const DATA_API_URL = process.env.DATA_API_URL || API_URL

if (!RPC_URL) {
  console.error('ERROR: RPC_URL not set')
  console.error(`\nusage: ./0.setup.js RPC_URL
    You need an Ethereum node to connect to.
    Either run one locally or use a service such as https://www.infura.io or https://www.alchemy.com`)
  process.exit(1)
}

const configFileName = process.env.CONFIG_FILE_NAME || 'config.json'
const configFilePath = `${__dirname}/${configFileName}`

const getBalanceInEth = async (web3, account) => {
  return web3.utils.fromWei(
    await web3.eth.getBalance(account.address),
    'ether'
  )
}

const go = async (configPath) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL))

  let account

  if (configPath) {
    console.log(`using existing config at: ${configPath}`)

    const config = require(configPath)

    if (!(config.account && config.account.address)) throw new Error('account.address not defined in config')

    account = config.account
  } else {
    account = web3.eth.accounts.create()

    console.log('Created new Ethereum account:', account.address)

    saveAsJson(configFilePath, {
      RPC_URL,
      ETH_PRIVATE_KEY: account.privateKey,
      API_URL,
      DATA_API_URL,
      account
    })

    console.log(`Created ./${configFileName}`)
  }

  const balance = await getBalanceInEth(web3, account)

  const minBalance = 0.1

  if (balance < minBalance) {
    console.warn(
      `\nWARNING: Your account balance (${balance} ETH) migth be insufficient to run the examples.
    Please transfer some ETH to your account (${account.address}).
    You can use a faucet like: https://goerlifaucet.com/`
    )
  }
}

const ask = question => {
    return new P((resolve, reject) => {
      try {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        })

        rl.question(question, answer => {
          rl.close()
          resolve(answer)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

;(async () => {
  if (fs.existsSync(configFilePath)) {
    if (useExistingAccount) {
      await go(configFilePath)
    } else if (createNewAccount) {
      await go()
    } else {
      let answer
      // For non-interactive mode (reponds to the prompt below)
      if (process.argv.length >= 4) {
        switch (process.argv[3]) {
          case '--yes':
            answer = 'yes'
            break
          case '--no':
            answer = 'no'
            break
          default:
            break
        }
      }

      answer = answer || await ask(
        `The ./${configFileName} file exits, do you want to use this config?
    If you choose 'yes', existing ./${configFileName} will not be modified.
    If you chooce 'no', a new account will be created and the ./${configFileName} file overwritten (yes/no): `,
      )
      await (answer === 'yes'
          ? go(configFilePath)
          : go()
      )
    }
  } else {
    await go()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
