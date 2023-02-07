let withdrawalId
const withdrawals = await rhinofi.getWithdrawals()

if (withdrawals.length == 0) {
  console.log('creating a new withdrawal')

  const token = 'ETH'
  const amount = 0.1

  const withdrawalResponse = await rhinofi.withdraw(
    token,
    amount,
    starkPrivKey
  )

  console.log('withdrawalResponse', withdrawalResponse)
  withdrawalId = withdrawalResponse._id
}
else {
  withdrawalId = withdrawals[0]._id
}

const getWithdrawalResponse = await rhinofi.getWithdrawal(withdrawalId)

logExampleResult(getWithdrawalResponse)
