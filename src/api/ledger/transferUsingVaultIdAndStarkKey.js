const post = require('../../lib/dvf/post-generic')
const makeCreateSignedTransferTxLedger = require('../../lib/ledger/makeCreateSignedTransferTxLedger')

module.exports = async (dvf, transferData, path, feeRecipient) => {
  const url = dvf.config.api + '/v1/trading/w/transfer'
  const createSignedTransferTx = makeCreateSignedTransferTxLedger(dvf)(path)
  const json = await dvf.createTransferPayload(transferData, feeRecipient, createSignedTransferTx)
  return post(dvf, url, { json })
}
