/**
 * Finds and returns an account based on given id.
 *
 * id - Can be an index of the array such as 0 or an address
 **/
module.exports = async (efx, id) => {
  // check for ethereum accounts and select a default one
  const accounts = await efx.web3.eth.getAccounts()

  if (typeof id === 'number') {
    if (!accounts[id]) {
      console.error('Error: You have no account at index:', +id)
    }

    // emit and store current account
    return efx.set('account', accounts[id])
  }

  for (let index in accounts) {
    if (accounts[index] === id) {
      // emit and store current account
      return efx.set('account', accounts[index])
    }
  }

  return efx.set('account', null)
}
