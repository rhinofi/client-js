const waitForDepositCreditedOnChain = require('./helpers/waitForDepositCreditedOnChain')

const depositResponse = await dvf.deposit('ETH', 0.70, starkPrivKey)

if (process.env.WAIT_FOR_DEPOSIT_READY === 'true') {
  await waitForDepositCreditedOnChain(dvf, depositResponse)
}

logExampleResult(depositResponse)
