const bind = require('./lib/dvf/bindApi')
const defaultConfig = require('./config')
const Web3 = require('web3')
const aware = require('aware')
const BigNumber = require('bignumber.js')
BigNumber.config({ EXPONENTIAL_AT: 1e+9 })

/**
 * web3 - web3 object
 * config - config to be merged with defaultConfig
 */
module.exports = async (web3, userConfig = {}) => {
  // binds all ./api methods into a fresh object, similar to creating an instance
  let dvf = bind()

  // adds key-value storage and event emitting capabilities
  aware(dvf)
  // merge user config with default config
  // needed for the dvf.getConfig method
  dvf.config = Object.assign({}, defaultConfig, userConfig)

  // ethfinex exchange config
  const exchangeConf = await dvf.getConfig()

  // user config has priority
  dvf.config = Object.assign({}, defaultConfig, exchangeConf, userConfig)

  // working towards being as compatible as possible
  dvf.isBrowser = typeof window !== 'undefined'

  dvf.isMetaMask = false

  if (dvf.isBrowser && window.web3) {
    dvf.isMetaMask = window.web3.currentProvider.isMetaMask
  }

  // If no web3 is provided we will fallback to:
  // - window.web3.currentProvider object i.e. user is using MetaMask
  // - http://localhost:8545
  if (!web3) {
    // sudo make-me browser friendly
    if (dvf.isBrowser && window.web3) {
      web3 = new Web3(window.web3.currentProvider)
    } else {
      web3 = new Web3(dvf.config.defaultProvider)
    }
  }

  // save web3 instance int it
  dvf.web3 = web3

  // REVIEW: should we actually use web3.eth.defaultAccount ?
  // see: https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#raising_hand-account-list-reflects-user-preference
  await dvf.account.select(dvf.config.account)

  if (!dvf.get('account')) {
    console.warn('Please specify a valid account or account index')
  }

  // Add userConfig to config
  const exchangeUserConf = await dvf.getUserConfig()
  dvf.config = Object.assign(dvf.config, exchangeUserConf)

  return dvf
}
