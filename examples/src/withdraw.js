const token = 'ETH'
const amount = 0.05

const withdrawalResponse = await dvf.withdraw(
  token,
  amount,
  starkPrivKey
)

console.log('withdraw response ->', withdrawalResponse)
