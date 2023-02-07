const transferResponse = await rhinofi.transfer({
  recipientEthAddress: '0x5317c63f870e8D2f85f0dE3c2666D1414f5a728c',
  token: 'USDT',
  amount: 1
})

logExampleResult(transferResponse)