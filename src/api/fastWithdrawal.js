const post = require('../lib/dvf/post-generic')

module.exports = async (dvf, withdrawalData) => {
  const url = '/v1/trading/w/fastWithdrawal'
  const json = await dvf.createFastWithdrawalPayload(withdrawalData)
  return post(dvf, url, { json })
}
