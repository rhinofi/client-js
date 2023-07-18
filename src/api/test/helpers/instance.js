/**
 * Creats a client instance for testing
 **/
const getWeb3 = require('../../../../examples/helpers/getWeb3')

const RhinofiClientFactory = require('../../../index')

module.exports = async () => {
  const rpcUrl = process.env.RPC_URL
  const privateKey = process.env.PRIVATE_ETH_KEY

  const { web3 } = getWeb3(privateKey, rpcUrl)

  const gasStationApiKey = process.env.ETH_GAS_STATION_KEY || ''

  const config = { gasStationApiKey }

  // It's possible to overwrite the API address with the testnet address
  // for example like this:
  // config.api = 'https://api.stg.rhino.fi'
  // config.api = 'http://localhost:7777/v1/trading'
  return RhinofiClientFactory(web3, config)
}
