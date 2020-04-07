const post = require('../lib/dvf/post-authenticated')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, nonce, signature) => {
  if (token) {
    validateAssertions(dvf, { token })
  }

  const endpoint = '/v1/trading/r/getPendingWithdrawals'

  const data = { token }

  const withdrawals = await post(dvf, endpoint, nonce, signature, data)

  for (const key in dvf.config.tokenRegistry) {
    const available = await dvf.contract.getWithdrawalBalance(key)

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
