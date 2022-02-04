module.exports = {
  // api: 'https://rpc.gateway.fm/v1/starkex/stg',
  api: 'https://rpc.gateway.fm/v1/starkex/stg',
  gasApi: 'https://ethgasstation.info',

  // can be obtained at admin.gateway.fm after creating a project
  apiKey: `Missing api key`,

  // default transaction arguments
  defaultGasLimit: 300000,
  defaultGasPrice: 50000000000,

  // default stark related constants
  // default expiration time for transfers and orders in hours
  defaultStarkExpiry: 4320,
  // default nonce age in seconds
  defaultNonceAge: 43200,
  // in case no provider is provided we will try connecting to the this default

  // address
  defaultProvider: 'http://localhost:8545',

  // default account to select in case no account is provided by the userConfig
  // parameter
  account: 0,
  // selects account from web3 provider based on config.account upon
  // initialization
  autoSelectAccount: true,

  // Ledger Stark Path Constants
  purpose: 2645,
  plugin: 579218131,
  application: 1393043894,
  accountIndex: 0,


  // enables integrators to select if they want to fetch user config upon initialization
  autoLoadUserConf: true,
  autoLoadExchangeConf: true,

  // enables integrations exposing starkProvider
  starkProvider: null
}
