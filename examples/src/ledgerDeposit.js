const path = `44'/60'/0'/0'/0`
const token = 'ETH'
const amount = 0.70

const starkDepositData = await rhinofi.stark.ledger.createDepositData(
  path,
  token,
  amount
)

const depositResponse = await rhinofi.ledger.deposit(
  token,
  amount,
  starkDepositData
)

logExampleResult(depositResponse)
