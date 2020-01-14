/**
 * - Creates an dvf instance
 * - Load all functions from the ./api folder into this instance
 * - Binds the functions so they will always receive dvf as first argument
 *
 * This way we get a regular looking API on top of functional code
 */
const _ = require('lodash')

module.exports = () => {
  const dvf = {}

  // will catch errors thrown by encapsulated function
  const execute = funk => {
    // returns a function that will call api functions 
    // prepending the dvf itself as first argument
    const partial = _.partial(funk, dvf)

    return async () => {
      try {
        // forward arguments received by the returned function
        return await partial.apply(null, arguments)
      } catch(e){
        // maybe we should allow the error to throw ?
        if (error instanceof DVFError) {
          return {
            type: 'DVFError',
            error: error.message,
            message: error.friendlyMessage,
            data: error.data
          }
        } else {
          let errorCode = ''
      
          if (error.error && error.error.code) {
            errorCode = error.error.code
          } else {
            errorCode = error.message
          }
      
          return {
            type: 'Error',
            error: errorCode
          }
        }
      }
    }
  }

  // dvf.account functions
  dvf.account = {
    balance: execute(require('../api/account/balance')),
    tokenBalance: execute(require('../api/account/tokenBalance')),
    select: execute(require('../api/account/select'))
  }

  dvf.stark = {
    createOrder: execute(require('../api/contract/createOrder')),
    sign: execute(require('../api/contract/signOrder')),
    getTransferMsg: require('../api/contract/getTransferMessage'),
    createPrivateKey: require('../api/stark/createPrivateKey'),
    createStarkKeyPair: require('../api/stark/createStarkKeyPair'),
    register: require('../api/contract/register')
  }
  // dvf.contract functions
  dvf.contract = {
    approve: execute(require('../api/contract/approve')),
    isApproved: execute(require('../api/contract/isApproved')),
    deposit: execute(require('../api/contract/deposit')),
    createOrderV2: execute(require('../api/contract/createOrder')),
    abi: {
      token: require('../api/contract/abi/token.abi'),
      StarkEx: require('../api/contract/abi/StarkEx.abi')
    }
  }

  // dvf.eth functions
  dvf.eth = {
    call: execute(require('../api/eth/call')),
    send: execute(require('../api/eth/send')),
    getNetwork: execute(require('../api/eth/getNetwork'))
  }

  // dvf.sign functions
  dvf.sign = execute(require('../api/sign/sign'))
  dvf.sign.cancelOrder = execute(require('../api/sign/cancelOrder'))
  dvf.sign.request = execute(require('../api/sign/request'))

  // dvf main functions
  dvf.getConfig = execute(require('../api/getConfig'))
  dvf.getUserConfig = execute(require('../api/getUserConfig'))
  dvf.cancelOrder = execute(require('../api/cancelOrder'))
  dvf.deposit = execute(require('../api/deposit'))
  dvf.getBalance = execute(require('../api/getBalance'))
  dvf.getFeeRate = execute(require('../api/getFeeRate'))
  dvf.getOrder = execute(require('../api/getOrder'))
  dvf.getOrdersHist = execute(require('../api/getOrdersHist'))
  dvf.getOrders = execute(require('../api/getOrders'))
  dvf.register = execute(require('../api/register'))
  dvf.submitBuyOrder = execute(require('../api/submitBuyOrder'))
  dvf.submitOrder = execute(require('../api/submitOrder'))
  dvf.submitSellOrder = execute(require('../api/submitSellOrder'))

  return dvf
}
