let withdrawalId
const userAddress = rhinofi.get('account')
const withdrawals = await rhinofi.getWithdrawals(undefined, userAddress)
const nonFastWithdrawals = withdrawals.filter(w => !w.fastWithdrawalData)

if (nonFastWithdrawals.length === 0) {
  console.log('creating a new withdrawal')

  const token = 'ETH'
  const amount = 0.1

  const withdrawalResponse = await rhinofi.transferAndWithdraw({
    recipientEthAddress: userAddress,
    token,
    amount,
  })


  console.log('withdrawalResponse', withdrawalResponse)
  withdrawalId = withdrawalResponse._id
} else {
  withdrawalId = nonFastWithdrawals[0]._id
}

const canceledWithdrawal = await rhinofi.cancelWithdrawal(withdrawalId)

logExampleResult(canceledWithdrawal)
