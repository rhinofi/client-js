/**
 * Approves a token for locking
 *
 */
const { BN, toBN } = require('dvf-utils')
const getTokenAddressFromTokenInfoOrThrow = require('../../lib/dvf/token/getTokenAddressFromTokenInfoOrThrow')

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

module.exports = async (dvf, token, deposit, spender = dvf.config.DVF.starkExContractAddress, chain = 'ETHEREUM', options = {}) => {
  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
  const tokenAddress = getTokenAddressFromTokenInfoOrThrow(tokenInfo, chain)
  if (!tokenAddress) { // undefined is equivalent of 0x0... address
    // TODO: This code is not very safe if caller expects the result to be of
    // the shape returned by dvf.eth.send below.
    return true
  }

  const depositBN = deposit == null
    ? maxAmountBN
    : validateDepositAmountAndConvertToBN(deposit)

  const allowance = await dvf.contract.isApproved(token, chain, spender)

  const allowanceBN = toBN(allowance)

  if (allowanceBN.isGreaterThanOrEqualTo(depositBN)) {
    // As above
    return true
  }

  const approve = amount => dvf.eth.send(
    dvf.contract.abi.token,
    tokenAddress,
    'approve',
    [
      spender,
      amount
    ],
    null,
    {
      chain,
      ...options
    }
  )

  // For some tokens, the amount needs to be reset to 0 before setting it to
  // a new (non-zero) value.
  if (tokensWhichNeedResetToZero.includes(token) && !allowanceBN.isZero()) {
    await approve(0)
  }

  return approve(maxAmountBN.toString())
}
