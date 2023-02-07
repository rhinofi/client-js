const withdrawalResponse = await rhinofi.transferAndWithdraw({
  // ensure address is checksummed
  recipientEthAddress: '0x65d580E2F7f430abC110d3dc22572b97b364a5Ac',
  token: 'ETH',
  amount: 0.01
})

logExampleResult(withdrawalResponse)
