const Eth = require('@ledgerhq/hw-app-eth').default
const selectTransport = require('../../ledger/selectTransport')

module.exports = async (dvf, path) => {
  const Transport = selectTransport(dvf.isBrowser)
  const transport = await Transport.create()
  const eth = new Eth(transport)
  const tempKey = (await eth.starkGetPublicKey(path)).toString('hex')
  const starkPublicKey = {
    x: tempKey.substr(2, 64),
    y: tempKey.substr(66)
  }
  transport.close()
  return starkPublicKey
}
