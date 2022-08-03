#!/usr/bin/env node

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

  if (process.env.DO_TRANSFER) {
    // Send a transfer to another address
    const transferResponse = await dvf.transfer({
      recipientEthAddress: '0x5472cf4f1be2aa6ad27c6f93101f7899ccadbaf7',
      token: 'DVF',
      // Any string, can place your ID here
      memo: 'some_id_2',
      amount: 10
    })
  }

  const { nonce, signature } = await dvf.sign.nonceSignature()

  // Paginated endpoint that returns all transfers involving the
  // authenticated user. You must fetch all, then filter through them
  const transfers = await dvf.getAuthenticated(
    '/v1/trading/transfers',
    nonce,
    signature,
    {
      // Pagination parameters here
      // Refer to swagger docs for a list of supported
      // options: https://api.deversifi.dev/v1/trading/docs#/Wallet/getV1TradingTransfers
    },
    {}
  )

  logExampleResult(transfers)

  // Find a transfer with memo = 'some_id_2'
  const getTransferWithMemo = async (memo, current = 0) => {
    const limit = 1
    const { items, pagination } = await dvf.getAuthenticated(
      '/v1/trading/transfers',
      nonce,
      signature,
      {
        limit,
        skip: current
      },
      {}
    )

    const [result] = items.filter(t => t.memo === memo)
    if (result) return result

    if (pagination.totalItems <= current + limit) return

    return getTransferWithMemo(memo, current + limit)
  }

  logExampleResult(await getTransferWithMemo('some_id_2'))
})()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
