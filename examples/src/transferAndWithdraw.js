const token = 'ETH'
const amount = 0.1

const withdrawalResponse = await rhinofi.transferAndWithdraw({
  recipientEthAddress: rhinofi.get('account'),
  token,
  amount,
})

logExampleResult(withdrawalResponse)
