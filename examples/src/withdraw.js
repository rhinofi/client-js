const token = 'ETH'
const amount = 0.1

const withdrawalResponse = await rhinofi.withdraw(
  token,
  amount,
  starkPrivKey
)

logExampleResult(withdrawalResponse)
