const FP = require('lodash/fp')
const BN = require('bignumber.js')
const Eth = require('@ledgerhq/hw-app-eth').default
const DVFError = require('../dvf/DVFError')
const selectTransport = require('./selectTransport')

const transferTransactionTypes = [
  'ConditionalTransferRequest',
  'TransferRequest'
]

const getTxSignature = async (dvf, tx, path) => {
  if (transferTransactionTypes.includes(tx.type)) {
    const Transport = selectTransport(dvf.isBrowser)
    const transport = await Transport.create()
    const eth = new Eth(transport)
    const {address} = await eth.getAddress(path)
    const starkPath = dvf.stark.ledger.getPath(address)
    const {tokenAddress, quantization} = dvf.token.getTokenInfoByTokenId(tx.token)
    const transferQuantization = new BN(quantization)

    // Load token information for Ledger device
    await dvf.token.provideContractData(eth, tokenAddress, transferQuantization)

    const starkSignature = await eth.starkSignTransfer_v2(
      starkPath,
      tokenAddress,
      tokenAddress ? 'erc20' : 'eth',
      transferQuantization,
      null,
      tx.senderPublicKey,
      tx.senderVaultId,
      tx.receiverVaultId,
      tx.amount,
      tx.nonce,
      tx.expirationTimestamp,
      tx.type === 'ConditionalTransferRequest' ? tx.factRegistryAddress : null,
      tx.type === 'ConditionalTransferRequest' ? tx.fact : null
    )
    await transport.close()

    return starkSignature
  } else {
    throw new DVFError(`Unsupported stark transaction type: ${tx.type}`, {tx})
  }
}

module.exports = (dvf) => {
  if (!dvf.config.wallet.path) throw new DVFError('LEDGER_PATH_IS_REQUIRED')
  let starkPublicKey

  const getPublicKey = async () => {
    if (starkPublicKey) { return starkPublicKey }
    starkPublicKey = await dvf.stark.ledger.getPublicKey(path)
    return starkPublicKey
  }

  const sign = async tx => {
    const starkSignature = await getTxSignature(dvf, tx, dvf.config.wallet.path)
    return FP.mapValues(
      x => '0x' + x,
      starkSignature
    )
  }

  return {sign, getPublicKey}
}
