const path = `44'/60'/0'/0'/0`
const token = 'ETH'
const amount = 0.70

const starkDepositData = await dvf.stark.ledger.createDepositData(
  path,
  token,
  amount
)

const depositResponse = await dvf.ledger.deposit(
  token,
  amount,
  starkDepositData
)

console.log('deposit response ->', 'depositResponse')
