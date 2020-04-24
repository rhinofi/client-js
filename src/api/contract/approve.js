/**
 * Approves a token for locking
 *
 */
module.exports = async (dvf, token, deposit) => {
  if (token === 'ETH') {
    return true
  }

  const currency = dvf.token.getTokenInfo(token)

  const maxAmount = (2 ** 256 - 1).toString(16)

  if (!deposit) {
    deposit = maxAmount
  }

  const allowance = parseInt(await dvf.contract.isApproved(token))

  const action = 'approve'

  if (allowance > deposit) {
    return true
  }

  if (token === 'USDT' && allowance !== 0) {
    const args = [
      dvf.config.DVF.starkExContractAddress, // address _spender
      0
    ]
    await dvf.eth.send(
      dvf.contract.abi.token,
      currency.tokenAddress,
      action,
      args
    )
  }

  const args = [
    dvf.config.DVF.starkExContractAddress, // address _spender
    maxAmount // uint amount
  ]

  return dvf.eth.send(
    dvf.contract.abi.token,
    currency.tokenAddress,
    action,
    args
  )
}
