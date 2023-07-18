const P = require('@rhino.fi/aigle')

module.exports = async (rhinofi, deposit) => {
  console.log('waiting for deposit to be credited on chain...')

  while (true) {
    // TODO: add getDeposit to pub-api and client and use it here.
    const deposits = await rhinofi.getDeposits(deposit.token)
    if (deposits.find(d => d._id === deposit._id && d.status === 'ready')) {
      break
    }
    console.log('still waiting...')
    await P.delay(2000)
  }
}