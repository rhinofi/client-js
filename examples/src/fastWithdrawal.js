const fastWithdrawalResponse = await rhinofi.fastWithdrawal(
  // recipientEthAddress could be added here to send the withdrawal to address
  // other then users registered address.
  { token: 'ETH', amount: 0.1 }
)

logExampleResult(fastWithdrawalResponse)
