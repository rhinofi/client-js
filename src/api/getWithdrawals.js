const post = require('../lib/dvf/post-authenticated')
const validateAssertions = require('../lib/validators/validateAssertions')

// TO DO: Remove this when we are confident to use the WithdrawalBalanceReader contract
const getWithdrawalBalancesDeprecated = async (dvf, withdrawals, starkKey) => {
  for (const key in dvf.config.tokenRegistry) {
    const available = await dvf.contract.getWithdrawalBalance(key, starkKey)

    if (parseInt(available) > 0) {
      const amount = dvf.token.toQuantizedAmount(
        key,
        dvf.token.fromBaseUnitAmount(key, available)
      )

      withdrawals.push({
        token: key,
        status: 'ready',
        amount
      })
    }
  }

  return withdrawals
}


module.exports = async (dvf, token, nonce, signature, starkKey) => {
  if (token) {
    validateAssertions(dvf, { token })
  }

  const endpoint = '/v1/trading/r/getPendingWithdrawals'

  const data = { token }

  const withdrawals = await post(dvf, endpoint, nonce, signature, data)

  if (!dvf.config.DVF.withdrawalBalanceReaderContractAddress) {
    // Use the deprecated way of getting balances in case the
    // WithdrawalBalanceReaderContractAddress was not set
    return getWithdrawalBalancesDeprecated(dvf, withdrawals, starkKey)
  }

  const tokenMap = dvf.config.tokenRegistry;
  const tokenMapKeys = Object.keys(dvf.config.tokenRegistry);
  const starkTokenIds = tokenMapKeys.map(key => tokenMap[key].starkTokenId)

  const balances = await dvf.contract.getAllWithdrawalBalances(starkTokenIds, starkKey)

  return balances.reduce((all, balance, index) => {
    const key = tokenMapKeys[index]

    if (parseInt(balance) > 0) {
      const amount = dvf.token.toQuantizedAmount(
        key,
        dvf.token.fromBaseUnitAmount(key, balance)
      )

      all.push({
        token: key,
        status: 'ready',
        amount
      })
    }
    return all
  }, withdrawals)
}