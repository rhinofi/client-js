const wallet = {
  type: 'tradingKey',
  meta: {
    starkPrivateKey: starkPrivKey
  }
}
// NOTE: this can also be done when creating DVF instance by including wallet on
// dvfConfig.
dvf.util.attachStarkProvider(wallet)

const fastWithdrawalResponse = await dvf.fastWithdrawal(
  // recipientEthAddress could be added here to send the withdrawal to address
  // other then users registered address.
  { token: 'ETH', amount: 0.1 }
)

logExampleResult(fastWithdrawalResponse)
