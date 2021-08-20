let withdrawalId
const withdrawals = await dvf.getWithdrawals()
const nonFastWithdrawals = withdrawals.filter(w => !w.fastWithdrawalData)

if (nonFastWithdrawals.length === 0) {
  console.log('creating a new withdrawal')

  const token = 'ETH'
  const amount = 0.1

  const withdrawalResponse = await dvf.withdraw(
    token,
    amount,
    starkPrivKey
  )

  console.log('withdrawalResponse', withdrawalResponse)
  withdrawalId = withdrawalResponse._id
} else {
  withdrawalId = nonFastWithdrawals[0]._id
}

const canceledWithdrawal = await dvf.cancelWithdrawal(withdrawalId)

logExampleResult(canceledWithdrawal)
