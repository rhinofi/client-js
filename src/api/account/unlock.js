/**
 * Unlocks an account for given duration
 **/
module.exports = (efx, password, duration = 60) => {
  const {web3} = efx

  // TODO: can we improve this somehow?
  return web3.eth.personal.unlockAccount(
    efx.get('account'),
    password
  )
}
