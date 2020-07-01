const path = `44'/60'/0'/0'/0`
const token = 'ETH'
const amount = 0.10

const starkWithdrawalData = await dvf.stark.ledger.createWithdrawalData(
  path,
  token,
  amount
)

const withdrawResponse = await dvf.ledger.withdraw(
  token,
  amount,
  starkWithdrawalData
)

console.log('withdraw response ->', withdrawResponse)
