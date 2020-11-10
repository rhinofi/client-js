// build artifacts and deploy
const Web3 = require('web3')

module.exports = async (contract, name) => {
  const provider = new Web3.providers.HttpProvider('http://localhost:8545')

  const web3 = new Web3(provider)

  const WETH = new web3.eth.Contract(JSON.parse(contract.interface))

  const accounts = await web3.eth.getAccounts()

  const deployed = await WETH.deploy({data: contract.bytecode}).send({
    from: accounts[0],
    gas: 1500000,
    gasPrice: '30000000000000'
  })

  // save in memory reference
  require('./deployed')[name] = deployed

  return deployed
}
