#!/usr/bin/env node

/*
1. Create new Ethereum wallet on ropsten
2. Loads it with Eth
3. Saves the private key in config.json
*/

const _ = require('lodash')
const fs = require('fs')
const readline = require('readline')
const Web3 = require('web3')
const P = require('aigle')

const logMyIP = require('./helpers/logMyIP')
const spawnProcess = require('./helpers/spawnProcess')
const request = require('./helpers/request')
const saveAsJson = require('./helpers/saveAsJson')

const INFURA_PROJECT_ID = process.argv[2]
const useTor = process.env.USE_TOR === 'true'
const createNewAccount = process.env.CREATE_NEW_ACCOUNT === 'true'
const useExistingAccount = process.env.USE_EXISTING_ACCOUNT === 'true'
const waitForBalance = process.env.WAIT_FOR_BALANCE === 'true'
const API_URL = process.env.API_URL || 'https://api.stg.deversifi.com'
const DATA_API_URL = process.env.DATA_API_URL || API_URL

if (!INFURA_PROJECT_ID) {
  console.error('Error: INFURA_PROJECT_ID not set')
  console.error('\nusage: ./0.setup.js INFURA_PROJECT_ID')
  console.error('\n  you can obtain an INFURA_PROJECT_ID by following instructions here: https://ethereumico.io/knowledge-base/infura-api-key-guide ')
  console.error('    NOTE: the `API KEY` mentioned in the instructions has been renamed to `PROJECT ID`.')
  console.error('\n  if you get an error when requesting Eth from a faucet, set USE_TOR=true env var to make requests via a TOR (using https://www.npmjs.com/package/tor-request)')
  console.error('    NOTE: tor executable needs to be on your path for this to work (it will be started/stopped automatically)')
  console.error('    tor can be installed via brew on MacOS or using your distros package manager if you are using linux')
  process.exit(1)
}

const configFileName = process.env.CONFIG_FILE_NAME || 'config.json'
const configFilePath = `${__dirname}/${configFileName}`

const ethRequestOptsForUrl = {
  'https://faucet.ropsten.be': (address) => `https://faucet.ropsten.be/donate/${address}`,
  // This one gives on only 0.5 eth
  'https://ropsten.faucet.b9lab.com': (address) => {
    return {
      uri: 'https://ropsten.faucet.b9lab.com/tap',
      method: 'POST',
      json: true,
      body: { toWhom: address }
    }
  },
  'https://faucet.metamask.io': (address) => {
    return {
      uri: 'https://faucet.metamask.io',
      method: 'POST',
      form: address
    }
  }
}

const getBalanceInEth = async (web3, account) => {
  return web3.utils.fromWei(
    await web3.eth.getBalance(account.address),
    'ether'
  )
}

const checkBalance = async (web3, account, requiredBalance) => {
  console.log('checking balance')
  console.log('requiredBalance (ETH):', requiredBalance)
  const balance = await getBalanceInEth(web3, account)
  console.log('account balance (ETH):', balance)
  if (balance < requiredBalance) {
    throw new Error(`unsufficient balance: ${balance}, requiredBalance: ${requiredBalance}`)
  }
}

const requestEth = (serviceUrl, address) => {
  console.log(`Requesting Eth from: ${serviceUrl}`)

  return request(useTor, ethRequestOptsForUrl[serviceUrl](address))
    .then(({ response, body }) => {

      // ropsten.faucet.b9lab.com still responds with 200 if rate limiting kicks
      // in, so we need to parse the error from the body.
      if (_.get(body, 'txHash.errorMessage')) throw { response, body }

      console.log(`Request for Eth from ${serviceUrl} succeeded! Response body:`, body)
      console.log('Please allow some time for the transaction to be validated.')
      return true
    })
    .catch(data => {
      console.error(`Request for Eth from ${serviceUrl} failed!`, {
        error: data.error,
        statusCode: data.response && data.response.statusCode,
        body: data.body
      })
      return false
    })
}

const maybeSpawnTor = async () => {
  if (!useTor) return

  console.log('Starting TOR...')

  const torProcess = spawnProcess({
    command: ['tor'],
    waitForLogOnInit: /.*Bootstrapped 100% \(done\): Done.*/,
    log: false
  })

  await logMyIP(true)
  return torProcess
}

const maybeKillTor = async (torProcess) => {
  if (!useTor) return

  console.log('Killing TOR...')

  await torProcess.kill(null, 'SIGINT')
  console.log('TOR killed.')
}

const getEth = async (account) => {
  const torProcess = await maybeSpawnTor()

  let gotEth = await requestEth('https://faucet.metamask.io', account.address)

  if (!gotEth) {
    gotEth = await requestEth('https://faucet.ropsten.be', account.address)
  }

  await maybeKillTor(torProcess)

  return gotEth
}

const go = async (configPath) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(
    `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`
  ))

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
      INFURA_PROJECT_ID,
      ETH_PRIVATE_KEY: account.privateKey,
      API_URL,
      DATA_API_URL,
      account
    })

    console.log(`Created ./${configFileName}`)
  }

  const hasSufficientBalanceOrThrow = () => checkBalance(web3, account, 1)

  await hasSufficientBalanceOrThrow()
    // If not enough balance, try to get some.
    .catch(async () => {
      const gotEth = await getEth(account)

      if (!gotEth) {
        console.error('attempts to get Eth failed!')
        process.exit(1)
      }
    })

  if (waitForBalance) {
    await P.retry(
      { times: 360, interval: 1000 },
      hasSufficientBalanceOrThrow
    )
  }

  // For some reason the process hangs here sometimes when using tor.
  process.exit()
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
      const answer = await ask(
        `The ./${configFileName} file exits, do you want to use this config?
        If you choose 'yes', existing ./${configFileName} will not be modified and Eth will be added to the account found in this config.
        If you chooce 'no', a new account will be created, Eth added to it and the ./${configFileName} file overwritten (yes/no): `,
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
