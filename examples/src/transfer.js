const transferResponse = await rhinofi.transfer({
  recipientEthAddress: rhinofi.config.DVF.deversifiAddress,
  token: 'USDT',
  amount: 5
})

logExampleResult(transferResponse)