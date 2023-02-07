const wallet = {
  type: 'tradingKey',
  meta: {
    starkPrivateKey: starkPrivKey
  }
}
// NOTE: this can also be done when calling RhinofiClientFactory by including wallet on
// rhinofiConfig.
rhinofi.util.attachStarkProvider(wallet)

const fastWithdrawalResponse = await rhinofi.fastWithdrawal(
  // recipientEthAddress could be added here to send the withdrawal to address
  // other then users registered address.
  { token: 'ETH', amount: 0.1 }
)

logExampleResult(fastWithdrawalResponse)
