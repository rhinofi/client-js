/**
 * Finds and returns an account based on given id.
 *
 * id - Can be an index of the array such as 0 or an address
 **/
module.exports = async (dvf, id) => {
  // check for ethereum accounts and select a default one
  const accounts = await dvf.web3.eth.getAccounts()

  if (typeof id === 'number') {
    if (!accounts[id]) {
      console.error('Error: You have no account at index:', +id)
    }

    // emit and store current account
    return dvf.set('account', accounts[id].toLowerCase())
  }

  for (let index in accounts) {
    if (accounts[index] === id) {
      // emit and store current account
      return dvf.set(
        'account',
        dvf.web3.utils.toChecksumAddress(accounts[index].toLowerCase())
      )
    }
  }

  return dvf.set('account', null)
}
