const path = `44'/60'/0'/0'/0`
const token = 'ETH'
const amount = 0.10

const withdrawResponse = await rhinofi.ledger.transferAndWithdraw(
  {
    recipientEthAddress: getAddress(dvf),
    token,
    amount,
  },
  path
)

logExampleResult(withdrawResponse)
