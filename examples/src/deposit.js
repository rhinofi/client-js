const waitForDepositCreditedOnChain = require('./helpers/waitForDepositCreditedOnChain')

const depositResponse = await dvf.depositV2({ token: 'USDT', amount: 1 })

if (process.env.WAIT_FOR_DEPOSIT_READY === 'true') {
  await waitForDepositCreditedOnChain(dvf, depositResponse)
}

logExampleResult(depositResponse)
