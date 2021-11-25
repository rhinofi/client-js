const makeCreateSignedTransferTxLedger = require('../../lib/ledger/makeCreateSignedTransferTxLedger')

module.exports = async (dvf, data, path, nonce, signature) => {
  return dvf.transferAndWithdraw(data, nonce, signature, makeCreateSignedTransferTxLedger(dvf)(path))
}
