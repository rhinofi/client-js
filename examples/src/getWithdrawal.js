let withdrawalId
const token = undefined
const userAddress = rhinofi.get('account')
const withdrawals = await rhinofi.getWithdrawals(token, userAddress)

if (withdrawals.length === 0) {
  console.log('creating a new withdrawal')

  const token = 'ETH'
  const amount = 0.1

  const withdrawalResponse = await rhinofi.transferAndWithdraw({
    recipientEthAddress: rhinofi.get('account'),
    token,
    amount
  })

  console.log('withdrawalResponse', withdrawalResponse)
  withdrawalId = withdrawalResponse._id
}
else {
  withdrawalId = withdrawals[0]._id
}

const getWithdrawalResponse = await rhinofi.getWithdrawal(withdrawalId)

logExampleResult(getWithdrawalResponse)