/**
 * Approves a token for locking
 *
 */
const { BN, toBN } = require('dvf-utils')

const maxAmountBN = BN(2).pow(96).minus(1)

const validateDepositAmountAndConvertToBN = amount => {
  const amountBN = toBN(amount)
  if (amountBN.isLessThanOrEqualTo(0)) {
    throw new Error('deposit amount should be >= 0')
  }

  if (!amountBN.isInteger()) {
    throw new Error('deposit amount should be >= 0')
  }

  return amountBN
}

const tokensWhichNeedResetToZero = ['USDT', 'OMG']

module.exports = async (dvf, token, deposit, spender = dvf.config.DVF.starkExContractAddress) => {
  if (token === 'ETH') {
    // TODO: This code is not very safe if caller expects the result to be of
    // the shape returned by dvf.eth.send below.
    return true
  }

  const depositBN = deposit == null
    ? maxAmountBN
    : validateDepositAmountAndConvertToBN(deposit)

  const allowance = await dvf.contract.isApproved(token, spender)

  const allowanceBN = toBN(allowance)

  if (allowanceBN.isGreaterThanOrEqualTo(depositBN)) {
    // As above
    return true
  }

  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)

  const approve = amount => dvf.eth.send(
    dvf.contract.abi.token,
    tokenInfo.tokenAddress,
    'approve',
    [
      spender,
      amount
    ]
  )

  // For some tokens, the amount needs to be reset to 0 before setting it to
  // a new (non-zero) value.
  if (tokensWhichNeedResetToZero.includes(token) && !allowanceBN.isZero()) {
    await approve(0)
  }

  return approve(maxAmountBN.toString())
}
