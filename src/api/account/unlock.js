/**
 * Unlocks an account for given duration
 **/
module.exports = (dvf, password, duration = 60) => {
  const {web3} = dvf

  // TODO: can we improve this somehow?
  return web3.eth.personal.unlockAccount(
    dvf.get('account'),
    password
  )
}
