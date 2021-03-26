const waitForDepositCreditedOnChain = require('./helpers/waitForDepositCreditedOnChain')

const keyPair = await dvf.stark.createKeyPair(starkPrivKey)

const depositResponse = await dvf.registerAndDeposit({ token: 'ETH', amount: 0.1 }, keyPair.starkPublicKey)

if (process.env.WAIT_FOR_DEPOSIT_READY === 'true') {
  await waitForDepositCreditedOnChain(dvf, depositResponse)
}

logExampleResult(depositResponse)
