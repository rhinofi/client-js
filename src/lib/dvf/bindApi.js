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

  // returns a function that will call api functions prepending dvf
  // as first argument
  const compose = funk => {
    return _.partial(funk, dvf)
  }

  // dvf.account functions
  dvf.account = {
    balance: compose(require('../../api/account/balance')),
    tokenBalance: compose(require('../../api/account/tokenBalance')),
    select: compose(require('../../api/account/select'))
  }

  dvf.stark = {
    createOrder: compose(require('../stark/createOrder')),
    createOrderMessage: require('../stark/createOrderMessage'),
    sign: require('../stark/starkSign'),
    createTransferMsg: require('../stark/createTransferMessage'),
    createPrivateKey: require('../stark/createPrivateKey'),
    createKeyPair: require('../stark/createKeyPair'),
    register: require('../../api/contract/register'),
    formatStarkPublicKey: require('../stark/formatStarkPublicKey'),
    ledger: {
      getPath: compose(require('../stark/ledger/getPath')),
      getPublicKey: compose(require('../stark/ledger/getPublicKey')),
      createWithdrawalData: compose(
        require('../stark/ledger/createWithdrawalData')
      ),
      createDepositData: compose(require('../stark/ledger/createDepositData')),
      createSignedTransfer: compose(
        require('../stark/ledger/createSignedTransfer')
      ),
      createSignedOrder: compose(
        require('../../lib/stark/ledger/createSignedOrder')
      )
    }
  }

  // dvf.contract functions
  dvf.contract = {
    approve: compose(require('../../api/contract/approve')),
    isApproved: compose(require('../../api/contract/isApproved')),
    deposit: compose(require('../../api/contract/deposit')),
    depositCancel: compose(require('../../api/contract/depositCancel')),
    depositReclaim: compose(require('../../api/contract/depositReclaim')),
    fullWithdrawalRequest: compose(require('../../api/contract/fullWithdrawalRequest')),
    getStarkKey: compose(require('../../api/contract/getStarkKey')),
    getWithdrawalBalance: compose(
      require('../../api/contract/getWithdrawalBalance')
    ),
    withdraw: compose(require('../../api/contract/withdraw')),
    abi: {
      token: require('../../api/contract/abi/token.abi'),
      StarkEx: require('../../api/contract/abi/StarkEx.abi')
    }
  }
  // dvf.token functions
  dvf.token = {
    getTokenInfo: compose(require('./token/getTokenInfo')),
    fromBaseUnitAmount: compose(require('./token/fromBaseUnitAmount')),
    fromQuantizedAmount: compose(require('./token/fromQuantizedAmount')),
    toBaseUnitAmount: compose(require('./token/toBaseUnitAmount')),
    toQuantizedAmount: compose(require('./token/toQuantizedAmount'))
  }

  // dvf.eth functions
  dvf.eth = {
    call: compose(require('../../api/eth/call')),
    send: compose(require('../../api/eth/send')),
    getNetwork: compose(require('../../api/eth/getNetwork'))
  }

  // dvf utility functions
  dvf.util = {
    generateRandomNonce: require('./generateRandomNonce')
  }

  // dvf.sign functions
  dvf.sign = compose(require('../../api/sign/sign'))
  dvf.sign.request = compose(require('../../api/sign/request'))
  dvf.sign.nonceSignature = compose(require('../../api/sign/nonceSignature'))

  dvf.postAuthenticated = compose(require('../../lib/dvf/post-authenticated'))

  dvf.createOrderPayload = compose(require('../../lib/dvf/createOrderPayload'))
  dvf.createOrderMetaData = compose(
    require('../../lib/dvf/createOrderMetaData')
  )

  // dvf main functions
  dvf.cancelOrder = compose(require('../../api/cancelOrder'))
  dvf.deposit = compose(require('../../api/deposit'))
  dvf.getDeposits = compose(require('../../api/getDeposits'))
  dvf.getBalance = compose(require('../../api/getBalance'))
  dvf.getConfig = compose(require('../../api/getConfig'))
  dvf.getDeposits = compose(require('../../api/getDeposits'))
  dvf.getFeeRate = compose(require('../../api/getFeeRate'))
  dvf.getOrder = compose(require('../../api/getOrder'))
  dvf.getOrders = compose(require('../../api/getOrders'))
  dvf.getOrdersHist = compose(require('../../api/getOrdersHist'))
  dvf.getUserConfig = compose(require('../../api/getUserConfig'))
  dvf.getVaultId = compose(require('../../api/getVaultId'))
  dvf.getVaultIdFromServer = compose(require('../../api/getVaultIdFromServer'))
  dvf.preRegister = compose(require('../../api/preRegister'))
  dvf.register = compose(require('../../api/register'))
  dvf.submitBuyOrder = compose(require('../../api/submitBuyOrder'))
  dvf.submitOrder = compose(require('../../api/submitOrder'))
  dvf.submitSellOrder = compose(require('../../api/submitSellOrder'))
  dvf.getWithdrawal = compose(require('../../api/getWithdrawal'))
  dvf.getWithdrawals = compose(require('../../api/getWithdrawals'))
  dvf.withdraw = compose(require('../../api/withdraw'))
  dvf.withdrawOnchain = compose(require('../../api/withdrawOnchain'))
  dvf.ledger = {
    deposit: compose(require('../../api/ledger/deposit')),
    withdraw: compose(require('../../api/ledger/withdraw'))
  }
  dvf.estimatedNextBatchTime = compose(require('../../api/estimatedNextBatchTime'))
  return dvf
}
