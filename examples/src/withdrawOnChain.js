const token = 'ETH'

const withdrawalResponse = await rhinofi.withdrawOnchain(token, rhinofi.config.ethAddress)

logExampleResult(withdrawalResponse)