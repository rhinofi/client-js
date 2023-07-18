/**
 * - Creates an dvf instance
 * - Load all functions from the ./api folder into this instance
 * - Binds the functions so they will always receive dvf as first argument
 *
 * This way we get a regular looking API on top of functional code
 */
const _partial = require('lodash/partial')

module.exports = () => {
  const dvf = {}

  // returns a function that will call api functions prepending dvf
  // as first argument
  const compose = (funk, ...args) => {
    return _partial(funk, dvf, ...args)
  }

  // dvf.account functions
  dvf.account = {
    balance: compose(require('../../api/account/balance')),
    tokenBalance: compose(require('../../api/account/tokenBalance')),
    select: compose(require('../../api/account/select')),
    getPermissions: compose(require('../../api/account/permissions').getPermissions),
    setPermissions: compose(require('../../api/account/permissions').setPermissions),
    getReferralId: compose(require('../../api/account/getReferralId')),
    getRemainingSpins: compose(require('../../api/account/getRemainingSpins')),
    getReferralRewards: compose(require('../../api/account/getReferralRewards')),
    postReferralSpin: compose(require('../../api/account/postReferralSpin'))
  }

  dvf.stark = {
    createOrder: compose(require('../stark/createOrder')),
    createMarketOrder: compose(require('../stark/createMarketOrder')),
    createOrderMessage: compose(require('../stark/createOrderMessage')),
    sign: compose(require('../stark/starkSign')),
    signAuth: compose(require('../stark/starkSignAuth')),
    signAmmFundingOrder: require('../stark/signAmmFundingOrder')(dvf),
    createTransferMsg: compose(require('../stark/createTransferMessage')),
    createPrivateKey: require('../stark/createPrivateKey'),
    createKeyPair: compose(require('../stark/createKeyPair')),
    register: require('../../api/contract/register'),
    formatStarkPublicKey: require('../stark/formatStarkPublicKey'),
    ledger: {
      getPath: compose(require('../stark/ledger/getPath')),
      getPublicKey: compose(require('../stark/ledger/getPublicKey')),
      createWithdrawalData: compose(
        require('../stark/ledger/createWithdrawalData')
      ),
      createFastWithdrawalPayload: compose(require('../stark/ledger/createFastWithdrawalPayload')),
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
    getPermitNonceForAddress: compose(require('../../api/contract/getPermitNonceForAddress')),
    getPermitNonceWithUnderscoreForAddress: compose(require('../../api/contract/getPermitNonceWithUnderscoreForAddress')),
    getNameForAddress: compose(require('../../api/contract/getNameForAddress')),
    deposit: compose(require('../../api/contract/deposit')),
    depositCancel: compose(require('../../api/contract/depositCancel')),
    depositReclaim: compose(require('../../api/contract/depositReclaim')),
    fullWithdrawalRequest: compose(require('../../api/contract/fullWithdrawalRequest')),
    getStarkKey: compose(require('../../api/contract/getStarkKey')),
    getWithdrawalBalance: compose(
      require('../../api/contract/getWithdrawalBalance')
    ),
    getWithdrawalBalanceEthAddress: compose(
      require('../../api/contract/getWithdrawalBalanceEthAddress')
    ),
    getAllWithdrawalBalances: compose(
      require('../../api/contract/getAllWithdrawalBalances')
    ),
    getAllWithdrawalBalancesEthAddress: compose(
      require('../../api/contract/getAllWithdrawalBalancesEthAddress')
    ),
    withdraw: compose(require('../../api/contract/withdraw')),
    abi: {
      token: require('../../api/contract/abi/token.abi'),
      getStarkEx: () => require('../../api/contract/abi/StarkExV4.abi'),
      WithdrawalBalanceReader: require('../../api/contract/abi/WithdrawalBalanceReader.abi'),
      getDVFInterface: () => require('../../api/contract/abi/DVFInterface.abi'),
      getSidechainBridgeInterface: () => require('../../api/contract/abi/BridgeDepositContract.abi')
    }
  }
  // dvf.token functions
  dvf.token = {
    // TODO: deprecate getTokenInfo
    provideContractData: compose(require('../ledger/provideContractData')),
    getTokenInfo: compose(require('./token/getTokenInfo')),
    getTokenInfoOrThrow: compose(require('./token/getTokenInfoOrThrow')),
    getTokenInfoForChainOrThrow: compose(require('./token/getTokenInfoForChainOrThrow')),
    getTokenInfoByTokenId: compose(require('./token/getTokenInfoByTokenId')),
    fromBaseUnitAmount: compose(require('./token/fromBaseUnitAmount')),
    fromQuantizedAmount: compose(require('./token/fromQuantizedAmount')),
    toBaseUnitAmount: compose(require('./token/toBaseUnitAmount')),
    toQuantizedAmount: compose(require('./token/toQuantizedAmount')),
    maxQuantizedDecimalPlaces: compose(require('./token/maxQuantizedDecimalPlaces'))
  }

  // dvf.eth functions
  dvf.eth = {
    getWeb3ForChain: compose(require('../../api/eth/getWeb3ForChain')),
    call: compose(require('../../api/eth/call')),
    send: compose(require('../../api/eth/send')),
    getNetwork: compose(require('../../api/eth/getNetwork')),
    getGasPrice: compose(require('../../api/eth/getGasPrice')),
    getGasStationPrice: compose(require('../../api/eth/getGasStationPrice'))
  }

  // dvf utility functions
  dvf.util = {
    generateRandomNonce: require('./generateRandomNonce'),
    dvfToBfxSymbol: require('../../lib/dvf/dvfToBfxSymbol'),
    bfxToDvfSymbol: require('../../lib/dvf/bfxToDvfSymbol'),
    prepareDepositAmount: compose(require('../util/prepareDepositAmount')),
    attachStarkProvider: compose(require('../../lib/wallet/attachStarkProvider'))
  }

  // dvf.bitfinex functions
  dvf.bitfinex = {
    transfers: compose(require('../../api/bitfinex/transfers'))
  }

  // dvf.migrationStampede
  dvf.migrationStampede = {
    getStampedeConfig: compose(require('../../api/migrationStampede/getStampedeConfig')),
    getMissionsConfig: compose(require('../../api/migrationStampede/getMissionsConfig')),
    getPotValue: compose(require('../../api/migrationStampede/getPotValue')),
    getUserMissions: compose(require('../../api/migrationStampede/getUserMissions')),
    getUserReward: compose(require('../../api/migrationStampede/getUserReward'))
  }

  dvf.userVerification = {
    setEmailOrPhone: compose(require('../../api/userVerification/setEmailOrPhone')),
    verifyCode: compose(require('../../api/userVerification/verifyCode')),
    isUserVerified: compose(require('../../api/userVerification/isUserVerified'))
  }

  // dvf.sign functions
  dvf.sign = compose(require('../../api/sign/sign'))
  dvf.sign.request = compose(require('../../api/sign/request'))
  dvf.sign.nonceSignature = compose(require('../../api/sign/nonceSignature'))

  dvf.postAuthenticated = compose(require('../../lib/dvf/post-authenticated'))

  dvf.deleteAuthenticated = compose(require('../../lib/dvf/delete-authenticated'))

  dvf.getAuthenticated = compose(require('../../lib/dvf/get-authenticated'))

  // Cancellable authenticated requests
  dvf.request = ['get', 'post'].reduce((acc, method) => {
    acc[method] = compose(require('../../lib/dvf/request'), method)
    return acc
  }, {})

  dvf.createOrderPayload = compose(require('../../lib/dvf/createOrderPayload'))
  dvf.createMarketOrderPayload = compose(require('../../lib/dvf/createMarketOrderPayload'))
  dvf.createOrderMetaData = compose(
    require('../../lib/dvf/createOrderMetaData')
  )
  dvf.createMarketOrderMetaData = compose(
    require('../../lib/dvf/createMarketOrderMetaData')
  )
  dvf.createFastWithdrawalPayload = compose(
    require('./createFastWithdrawalPayload')
  )
  dvf.createBridgedWithdrawalPayload = compose(
    require('./createBridgedWithdrawalPayload')
  )
  dvf.createTransferPayload = compose(
    require('./createTransferPayload')
  )
  dvf.createSignedTransfer = compose(
    require('./createSignedTransfer')
  )
  dvf.createTransferAndWithdrawPayload = compose(
    require('./createTransferAndWithdrawPayload')
  )
  // dvf trading volume data
  dvf.get30DaysVolume = compose(require('../../api/get30DaysVolume'))

  // dvf tickers
  dvf.getTickers = compose(require('../../api/getTickers'))

  // dvf get DLM APIs
  dvf.getTokenHolders = compose(require('../../api/getTokenHolders'))
  dvf.getTokenLiquidityLeft = compose(require('../../api/getTokenLiquidityLeft'))
  dvf.getTokenSaleStartEnd = compose(require('../../api/getTokenSaleStartEnd'))

  // dvf airdrop eligibility
  dvf.airdropEligibility = compose(require('../../api/airdropEligibility'))

  dvf.getBridgeContractAddressOrThrow = compose(
    require('../../lib/dvf/getBridgeContractAddressOrThrow')
  )

  dvf.getBridgeContractAddressOrThrow = compose(require('../../lib/dvf/getBridgeContractAddressOrThrow'))

  // dvf main functions
  dvf.cancelOrder = compose(require('../../api/cancelOrder'))
  dvf.cancelOpenOrders = compose(require('../../api/cancelOpenOrders'))
  dvf.cancelWithdrawal = compose(require('../../api/cancelWithdrawal'))
  dvf.deposit = compose(require('../../api/deposit'))
  dvf.depositV2 = compose(require('../../api/depositV2'))
  dvf.bridgedDeposit = compose(require('../../api/bridgedDeposit'))
  dvf.fastWithdrawal = compose(require('../../api/fastWithdrawal'))
  dvf.fastWithdrawalFee = compose(require('../../api/fastWithdrawalFee'))
  dvf.fastWithdrawalMaxAmount = compose(require('../../api/fastWithdrawalMaxAmount'))
  dvf.getWithdrawalQuote = compose(require('../../api/getWithdrawalQuote'))
  dvf.getDeposits = compose(require('../../api/getDeposits'))
  dvf.getBalance = compose(require('../../api/getBalance'))
  dvf.getBalanceUsd = compose(require('../../api/getBalanceUsd'))
  dvf.getConfig = compose(require('../../api/getConfig'))
  dvf.getDeposits = compose(require('../../api/getDeposits'))
  dvf.getFeeRate = compose(require('../../api/getFeeRate'))
  dvf.getGasPrice = compose(require('../../api/getGasPrice'))
  dvf.getOrder = compose(require('../../api/getOrder'))
  dvf.getOrders = compose(require('../../api/getOrders'))
  dvf.getOrdersHist = compose(require('../../api/getOrdersHist'))
  dvf.getUserConfig = compose(require('../../api/getUserConfig'))
  dvf.getUserConfigFromServer = compose(require('../../api/getUserConfigFromServer'))
  dvf.getVaultId = compose(require('../../api/getVaultId'))
  dvf.getVaultIdFromServer = compose(require('../../api/getVaultIdFromServer'))
  dvf.getVaultIdAndStarkKey = compose(require('../../api/getVaultIdAndStarkKey'))
  dvf.register = compose(require('../../api/register'))
  dvf.submitBuyOrder = compose(require('../../api/submitBuyOrder'))
  dvf.submitOrder = compose(require('../../api/submitOrder'))
  dvf.submitMarketOrder = compose(require('../../api/submitMarketOrder'))
  dvf.submitSellOrder = compose(require('../../api/submitSellOrder'))
  dvf.transferUsingVaultIdAndStarkKey = compose(require('../../api/transferUsingVaultIdAndStarkKey'))
  dvf.transfer = compose(require('../../api/transfer'))
  dvf.transferAndWithdraw = compose(require('../../api/transferAndWithdraw'))
  dvf.getWithdrawal = compose(require('../../api/getWithdrawal'))
  dvf.getWithdrawals = compose(require('../../api/getWithdrawals'))
  dvf.withdraw = compose(require('../../api/withdraw'))
  dvf.withdrawV2 = compose(require('../../api/withdrawV2'))
  dvf.bridgedWithdraw = compose(require('../../api/bridgedWithdraw'))
  dvf.withdrawOnchain = compose(require('../../api/withdrawOnchain'))
  dvf.getRegistrationStatuses = compose(require('../../api/getRegistrationStatuses'))
  dvf.fullWithdrawalRequest = compose(require('../../api/fullWithdrawalRequest'))
  dvf.getMinMaxOrderSize = compose(require('../../api/getMinMaxOrderSize'))
  dvf.postAmmFundingOrders = compose(require('../../api/amm/postAmmFundingOrders'))
  dvf.getAmmFundingOrders = compose(require('../../api/amm/getAmmFundingOrders'))
  dvf.getAmmFundingOrderData = compose(require('../../api/amm/getAmmFundingOrderData'))
  dvf.applyFundingOrderDataSlippage = compose(require('../../api/amm/applyFundingOrderDataSlippage'))
  dvf.poolTVL = compose(require('../../api/amm/poolTVL'))
  dvf.poolTvlHistory = compose(require('../../api/amm/poolTvlHistory'))
  dvf.poolVolume24Hours = compose(require('../../api/amm/poolVolume24Hours'))
  dvf.poolSwapFees = compose(require('../../api/amm/poolSwapFees'))
  dvf.poolAPY = compose(require('../../api/amm/poolAPY'))
  dvf.poolUserLpBalance = compose(require('../../api/amm/poolUserLpBalance'))
  dvf.poolStoredTokens = compose(require('../../api/amm/poolStoredTokens'))
  dvf.poolUserRewards = compose(require('../../api/amm/poolUserRewards'))
  dvf.poolUserAccruedFees = compose(require('../../api/amm/poolUserAccruedFees'))
  dvf.poolTokensRate = compose(require('../../api/amm/poolTokensRate'))
  dvf.poolsData = compose(require('../../api/amm/poolsData'))
  dvf.poolsUserData = compose(require('../../api/amm/poolsUserData'))
  dvf.getRewardsLockedState = compose(require('../../api/amm/getRewardsLockedState'))
  dvf.postRewardsLockedState = compose(require('../../api/amm/postRewardsLockedState'))
  dvf.walletFailedEvent = compose(require('../../api/walletFailedEvent'))
  dvf.walletSuccessEvent = compose(require('../../api/walletSuccessEvent'))
  dvf.topPerformersTokens = compose(require('../../api/topPerformersTokens'))

  dvf.ledger = {
    deposit: compose(require('../../api/ledger/deposit')),
    withdraw: compose(require('../../api/ledger/withdraw')),
    transfer: compose(require('../../api/ledger/transfer')),
    transferAndWithdraw: compose(require('../../api/ledger/transferAndWithdraw')),
    transferUsingVaultIdAndStarkKey: compose(require('../../api/ledger/transferUsingVaultIdAndStarkKey')),
    signEIP712Data: compose(require('../../api/ledger/signEIP712Data'))
  }
  dvf.estimatedNextBatchTime = compose(require('../../api/estimatedNextBatchTime'))
  dvf.publicUserPermissions = compose(require('../../api/getPublicPermissions'))
  return dvf
}
