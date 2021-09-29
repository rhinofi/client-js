const _ = require('lodash')
const Web3 = require('web3')
const tr = require('tor-request')
const P = require('aigle')

const { RPC_URL } = process.env

const request = arg =>
  new Promise((resolve, reject) => {
    const request = tr.request.bind(tr)

    return request(arg, (error, response, body) => {
      if (error || response.statusCode >= 400) {
        reject({ error, response, body })
      } else {
        resolve({ response, body })
      }
    })
  })

const ethRequestOptsForUrl = {
  'https://faucet.ropsten.be': address =>
    `https://faucet.ropsten.be/donate/${address}`,
  'https://ropsten.faucet.b9lab.com': address => {
    return {
      uri: 'https://ropsten.faucet.b9lab.com/tap',
      method: 'POST',
      json: true,
      body: { toWhom: address }
    }
  },
  'https://faucet.metamask.io': address => {
    return {
      uri: 'https://faucet.metamask.io',
      method: 'POST',
      form: address
    }
  }
}

const getBalanceInEth = async (web3, account) => {
  return web3.utils.fromWei(await web3.eth.getBalance(account.address), 'ether')
}

const checkBalance = async (web3, account, requiredBalance) => {
  const balance = await getBalanceInEth(web3, account)
  console.log('checking balance', '\nrequiredBalance (ETH):', requiredBalance, '\naccount balance (ETH):', balance)
  if (balance < requiredBalance) {
    throw new Error(
      `unsufficient balance: ${balance}, requiredBalance: ${requiredBalance}`
    )
  }
}

const requestEth = (serviceUrl, address) => {
  console.log(`Requesting Eth from: ${serviceUrl}`)

  return request(ethRequestOptsForUrl[serviceUrl](address))
    .then(({ response, body }) => {
      if (_.get(body, 'txHash.errorMessage')) throw { response, body }

      console.log(
        `Request for Eth from ${serviceUrl} succeeded! Response body:`,
        body
      )
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

const getEth = async account => {
  let gotEth = await requestEth('https://faucet.metamask.io', account.address)

  if (!gotEth) {
    // TODO: Not sure this faucet was working before transition to goerli
    gotEth = await requestEth('https://faucet.ropsten.be', account.address)
  }

  return gotEth
}

const go = async () => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(RPC_URL)
  )

  const account = web3.eth.accounts.create()
  console.log('Created new Ethereum account:', account.address)

  const gotEth = await getEth(account)

  if (!gotEth) {
    console.error('attempts to get Eth failed!')
    process.exit(1)
  }

  await P.retry(
    { times: 120, interval: 1000 },
    () => checkBalance(web3, account, 1)
  )

  return { ETH_PRIVATE_KEY: account.privateKey, RPC_URL, account }
}

const setup = async (existingAccount) => {
  if (!RPC_URL) {
    console.error('Error: RPC_URL not set')
    process.exit(1)
  }

  if (existingAccount) {
    return {RPC_URL, account: existingAccount}
  }

  return go()
}

module.exports = setup
