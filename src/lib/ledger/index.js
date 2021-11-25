const FP = require('lodash/fp')
const BN = require('bignumber.js')
const Eth = require('@ledgerhq/hw-app-eth').default
const DVFError = require('../dvf/DVFError')
const createSignedOrder = require('../stark/ledger/createSignedOrder')
const selectTransport = require('./selectTransport')
const swJS = require('starkware_crypto')
const getTokenAddressFromTokenInfoOrThrow = require('../dvf/token/getTokenAddressFromTokenInfoOrThrow')
const {
  starkTransferTxToMessageHash
} = require('dvf-utils')

const transferTransactionTypes = [
  'ConditionalTransferRequest',
  'TransferRequest'
]

const getMessage = sw => tx => {
  if (!(transferTransactionTypes.includes(tx.type))) {
    throw new DVFError(`Unsupported stark transaction type: ${tx.type}`, { tx })
  }
  return starkTransferTxToMessageHash(sw)(tx)
}

const getTxSignature = async (dvf, tx, path) => {
  if (tx.type != null) {
    if (!(transferTransactionTypes.includes(tx.type))) {
      throw new DVFError(`Unsupported stark transaction type: ${tx.type}`, { tx })
    }
    const Transport = selectTransport(dvf.isBrowser)
    const transport = await Transport.create()
    const eth = new Eth(transport)
    const { address } = await eth.getAddress(path)
    const starkPath = dvf.stark.ledger.getPath(address)
    const tokenInfo = dvf.token.getTokenInfoByTokenId(tx.token)
    const tokenAddress = getTokenAddressFromTokenInfoOrThrow(tokenInfo, 'ETHEREUM')
    const transferQuantization = new BN(tokenInfo.quantization)
    const transferAmount = new BN(tx.amount)

    try {
      // Load token information for Ledger device
      const tokenData = await dvf.token.provideContractData(eth, tokenAddress, transferQuantization)

      if (tokenData && tokenData.unsafeSign) {
        const message = getMessage(swJS)(tx)
        const paddedMessage = message.padStart(64, '0').substr(-64)
        return eth.starkUnsafeSign(
          starkPath,
          paddedMessage
        )
      }

      return await eth.starkSignTransfer_v2(
        starkPath,
        tokenAddress,
        tokenAddress ? 'erc20' : 'eth',
        transferQuantization,
        null,
        tx.receiverPublicKey,
        tx.senderVaultId,
        tx.receiverVaultId,
        transferAmount,
        tx.nonce,
        tx.expirationTimestamp,
        tx.type === 'ConditionalTransferRequest' ? tx.factRegistryAddress : null,
        tx.type === 'ConditionalTransferRequest' ? tx.fact : null
      )
    } finally {
      await transport.close()
    }
  } else {
    const { starkSignature } = await createSignedOrder(
      dvf, path, tx, { returnStarkPublicKey: false }
    )

    return starkSignature
  }
}

module.exports = (dvf) => {
  if (!dvf.config.wallet.meta.path) throw new DVFError('LEDGER_PATH_IS_REQUIRED')
  let starkPublicKey

  const getPublicKey = async () => {
    if (starkPublicKey) { return starkPublicKey }
    starkPublicKey = await dvf.stark.ledger.getPublicKey(dvf.config.wallet.meta.path)
    return starkPublicKey
  }

  const sign = async tx => {
    const starkSignature = await getTxSignature(dvf, tx, dvf.config.wallet.meta.path)
    return FP.mapValues(
      x => '0x' + x,
      starkSignature
    )
  }

  const getWalletType = () => 'LEDGER'

  return { sign, getPublicKey, getWalletType }
}
