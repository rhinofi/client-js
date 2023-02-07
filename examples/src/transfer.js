const transferResponse = await rhinofi.transfer({
  recipientEthAddress: '0x5472cf4f1be2aa6ad27c6f93101f7899ccadbaf7',
  token: 'USDT',
  amount: 5
})

logExampleResult(transferResponse)