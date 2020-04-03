const path = `21323'/0`
const token = 'ETH'
const amount = 0.95

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
