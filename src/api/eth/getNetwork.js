/*
 * Returns current network id and name
 * see:
 * https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#construction_worker-network-check
 *
 **/
module.exports = async (dvf) => {
  const id = await dvf.web3.eth.net.getId()

  const labels = {
    '1': 'mainnet',
    '2': 'morden',
    '3': 'ropsten',
    '4': 'Rinkeby',
    '42': 'Kovan'
  }

  return {
    id: id,
    name: labels[id] || 'unknown'
  }
}
