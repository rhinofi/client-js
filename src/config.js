module.exports = {

  // test environment 'https://test.ethfinex.com/trustless/v1',
  api: 'https://api.ethfinex.com/trustless/v1',

  // default expiration time for orders in seconds, used by create_order.js
  defaultExpiry: 3600,

  // in case no provider is provided we will try connecting to the this default
  // address
  defaultProvider: 'http://localhost:8545',

  // default account to select in case no account is provided by the userConfig
  // parameter
  account: 0

}
