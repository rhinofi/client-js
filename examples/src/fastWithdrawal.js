const fastWithdrawalResponse = await dvf.fastWithdrawal(
  { token: 'ETH', amount: 0.1 },
  starkPrivKey
)

logExampleResult(fastWithdrawalResponse)
