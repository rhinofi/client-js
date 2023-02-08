const waitForDepositCreditedOnChain = require('./helpers/waitForDepositCreditedOnChain')

const token1 = 'ETH'
const token2 = 'USDT'

if (process.env.DEPOSIT_FIRST === 'true') {
  const depositETHResponse = await rhinofi.deposit(token1, 0.1, starkPrivKey)
  const depositUSDTResponse = await rhinofi.deposit(token2, 1000, starkPrivKey)

  if (process.env.WAIT_FOR_DEPOSIT_READY === 'true') {
    await waitForDepositCreditedOnChain(rhinofi, depositETHResponse)
    await waitForDepositCreditedOnChain(rhinofi, depositUSDTResponse)
  }
}

const pool = `${token1}${token2}`

const ammDepositOrderData = await rhinofi.getAmmFundingOrderData({
  pool,
  token: token1,
  amount: 0.1
})

const ammDeposit = await rhinofi.postAmmFundingOrders(
  ammDepositOrderData
)

const P = require('aigle')

await P.retry(
  { times: 360, interval: 1000 },
  async () => {
    const existingDeposit = await rhinofi.getAmmFundingOrders(
      null,
      null,
      { ammFundingOrderId: ammDeposit._id }
    )

    if (existingDeposit.pending) {
      throw new Error('funding order for amm deposit still pending')
    }
  }
)

const { toBN } = require('@rhino.fi/dvf-utils')

const ammWithdrawalOrderData = await rhinofi.getAmmFundingOrderData({
  pool,
  token: `LP-${pool}`,
  // Withdraw previously deposited liquidity by returning all LP tokens.
  amount: ammDeposit.orders.reduce(
    (sum, order) => sum.plus(toBN(order.amountBuy)),
    toBN(0)
  )
})

const ammWithdrawal = await rhinofi.postAmmFundingOrders(
  await rhinofi.applyFundingOrderDataSlippage(ammWithdrawalOrderData, 0.05)
)

logExampleResult(ammWithdrawal)