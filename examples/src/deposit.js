const waitForDepositCreditedOnChain = require('./helpers/waitForDepositCreditedOnChain')

const depositResponse = await rhinofi.depositV2({ token: 'USDT', amount: 1 })

if (process.env.WAIT_FOR_DEPOSIT_READY === 'true') {
  await waitForDepositCreditedOnChain(rhinofi, depositResponse)
}

logExampleResult(depositResponse)
