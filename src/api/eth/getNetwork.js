/*
 * Returns current network id and name
 * see:
 * https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#construction_worker-network-check
 *
 **/
module.exports = async (dvf, chain) => {
  const web3 = dvf.eth.getWeb3ForChain(chain)
  const id = await web3.eth.net.getId()

  const labels = {
    '1': 'mainnet',
    '2': 'morden',
    '3': 'ropsten',
    '4': 'Rinkeby',
    '5': 'Goerli',
    '42': 'Kovan',
    '137': 'Matic Network',
    '80001': 'Mumbai'
  }

  return {
    id: id,
    name: labels[id] || 'unknown'
  }
}
