const token = 'ETH'
const amount = 0.1

// NOTE: withdraw method as been deprecated
const withdrawalResponse = await rhinofi.transferAndWithdraw({
  recipientEthAddress: rhinofi.get('account'),
  token,
  amount,
})

logExampleResult(withdrawalResponse)
