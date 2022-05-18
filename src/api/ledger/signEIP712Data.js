const selectTransport = require('../../lib/ledger/selectTransport')
const Eth = require('@ledgerhq/hw-app-eth').default
const { getStructHash } = require('eip-712')

// https://eips.ethereum.org/EIPS/eip-712
module.exports = async (dvf, jsonData, ledgerPath) => {
  const Transport = selectTransport(dvf.isBrowser)
  const createdTransport = await Transport.create()
  try {
    const ledgerEth = new Eth(createdTransport)
    const domainStructHash = getStructHash(jsonData, 'EIP712Domain', jsonData.domain)
    const domainStructString = Buffer.from(domainStructHash).toString('hex')
    const messageStructHash = getStructHash(jsonData, jsonData.primaryType, jsonData.message)
    const messageStructString = Buffer.from(messageStructHash).toString('hex')
    const signature = await ledgerEth.signEIP712HashedMessage(
      ledgerPath,
      domainStructString,
      messageStructString
    )
    return {
      r: Buffer.from(signature.r, 'hex'),
      s: Buffer.from(signature.s, 'hex'),
      v: signature.v
    }
  } finally {
    createdTransport.close()
  }
}
