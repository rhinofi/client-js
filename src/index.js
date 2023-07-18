const bind = require('./lib/dvf/bindApi')
const defaultConfig = require('./config')
const Web3 = require('web3')
const aware = require('aware')
const BigNumber = require('bignumber.js')
const attachStarkProvider = require('./lib/wallet/attachStarkProvider')
const isObject = require('lodash/isObject')
BigNumber.config({ EXPONENTIAL_AT: 1e9 })

/**
 * web3 - web3 object
 * config - config to be merged with defaultConfig
 */
module.exports = async (web3, userConfig = {}, sw) => {
  // binds all ./api methods into a fresh object, similar to creating an instance
  const dvf = bind()
  dvf.sw = sw

  // adds key-value storage and event emitting capabilities
  aware(dvf)
  // merge user config with default config
  // needed for the dvf.getConfig method
  dvf.config = Object.assign({}, defaultConfig, userConfig)

  // ethfinex exchange config
  const exchangeConf = dvf.config.autoLoadExchangeConf
    ? await dvf.getConfig()
    : {}

  // user config has priority
  dvf.config = Object.assign({}, defaultConfig, exchangeConf, userConfig)

  // working towards being as compatible as possible
  dvf.isBrowser = !process.versions.node

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

  // Guessing if web3 passed as argument is a single web3 instance
  // or a map of web3 instances (for cross-chain features)
  if (isObject(web3) && web3.DEFAULT) {
    dvf.web3 = web3.DEFAULT
    dvf.web3PerChain = web3
  // If single web3 passed as parameter, assuming it is Ethereum by default
  } else {
    dvf.web3 = web3
    dvf.web3PerChain = { DEFAULT: web3, ETHEREUM: web3 }
  }

  if (!dvf.config.skipLoad) {
    try {
      dvf.config.ethereumChainId = dvf.config.ethereumChainId || (await dvf.web3.eth.net.getId())
    } catch (e) {
      console.log('error getting chainId')
    }
  }

  if (dvf.config.autoSelectAccount) {
    await dvf.account.select(dvf.config.account)

    // if (!dvf.get('account')) {
    //   console.warn('Please specify a valid account or account index')
    // }
  } else if (dvf.config.address) {
    dvf.set('account', dvf.config.address.toLowerCase())
  }

  // get user config once we get the Web3 provider and Eth Address
  if (dvf.config.autoLoadUserConf) {
    try {
      await dvf.getUserConfig()
    } catch (e) {
      console.log(
        'Could not retrieve user configuration. Did the user register?'
      )
    }
  }

  if (!dvf.config.skipLoad) {
    dvf.recommendedGasPrices = await dvf.getGasPrice()
  }

  try {
    attachStarkProvider(dvf, userConfig.wallet)
    // Fail silently in case no wallet is provider since provider can be attached later
  } catch (e) {}

  return dvf
}
