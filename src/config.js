module.exports = {
  // test environment 'https://test.ethfinex.com/trustless/v1',
  api: 'https://api.deversifi.com/v1/trading',

  // default expiration time for orders in hours, used by create_order.js
  defaultExpiry: 720,

  // in case no provider is provided we will try connecting to the this default
  // address
  defaultProvider: 'http://localhost:8545',

  // default account to select in case no account is provided by the userConfig
  // parameter
  account: 0
}
