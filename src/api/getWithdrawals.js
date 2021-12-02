const post = require('../lib/dvf/post-authenticated')
const validateAssertions = require('../lib/validators/validateAssertions')

// TO DO: Remove this when we are confident to use the WithdrawalBalanceReader contract
const getWithdrawalBalancesDeprecated = async (dvf, withdrawals, tradingKey) => {
  for (const key in dvf.config.tokenRegistry) {
    const available = await dvf.contract.getWithdrawalBalance(key, tradingKey)

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

const balanceReducer = (dvf, tokenMapKeys, extraProps = {}) => (all, balance, index) => {
  const key = tokenMapKeys[index]

  if (parseInt(balance) > 0) {
    const amount = dvf.token.toQuantizedAmount(
      key,
      dvf.token.fromBaseUnitAmount(key, balance)
    )

    all.push({
      token: key,
      status: 'ready',
      amount,
      ...extraProps
    })
  }

  return all
}



module.exports = async (dvf, token, address, nonce, signature) => {
  if (token) {
    validateAssertions(dvf, { token })
  }

  const endpoint = '/v1/trading/r/getPendingWithdrawals'

  const data = { token }

  let withdrawals = await post(dvf, endpoint, nonce, signature, data)

  try {
    const { starkKeyHex } = dvf.config

    // Using registrationAndDepositInterfaceAddress as it contains the same method
    if (!dvf.config.DVF.registrationAndDepositInterfaceAddress) {
      // Use the deprecated way of getting balances in case the
      // WithdrawalBalanceReaderContractAddress was not set
      return await getWithdrawalBalancesDeprecated(dvf, withdrawals, starkKeyHex)
    }

    const tokenMap = dvf.config.tokenRegistry;
    const tokenMapKeys = Object.keys(dvf.config.tokenRegistry)
      // TODO: Filter hack for AMM launch. Optimal is to look at ammPools config 
      .filter(token => !token.startsWith('LP-'));
    const starkTokenIds = tokenMapKeys.map(key => tokenMap[key].starkTokenId)

    const balances = await dvf.contract.getAllWithdrawalBalances(starkTokenIds, starkKeyHex)
    withdrawals = balances.reduce(balanceReducer(dvf, tokenMapKeys), withdrawals)

    // Feature flag for v4
    if (dvf.config.DVF.starkExVersion === '4') {
      const ethBalances = await dvf.contract.getAllWithdrawalBalancesEthAddress(starkTokenIds, address)

      withdrawals = ethBalances.reduce(balanceReducer(dvf, tokenMapKeys, { target: address }), withdrawals)
    }

    return withdrawals
  } catch (e) {
    console.error('Error while fetching on-chain withdrawals information (returning only server withdrawals)', e)
    return withdrawals
  }
}
