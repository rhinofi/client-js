const Eth = require('@ledgerhq/hw-app-eth').default
const BN = require('bignumber.js')
const selectTransport = require('../../ledger/selectTransport')

module.exports = async (
  dvf,
  path,
  tokenInfo,
  quantizedAmount,
  sourceVault,
  destinationVault,
  receiverPublicKey
) => {
  // TODO support transfer with fees
  // Will happen if it's an ETH address instead of public key
  // ETH addresses a used in the context of StarkEx v4 withdrawals
  // Ledger seems to only sign correctly if the ETH address
  // is padded as if it was a stark public key
  if (receiverPublicKey && receiverPublicKey.length < 66) {
    const receiverPublicKeyWithoutPrefix = receiverPublicKey
      .slice(2)
      .padStart(64, '0')
    receiverPublicKey = '0x' + receiverPublicKeyWithoutPrefix
  }
  const Transport = selectTransport(dvf.isBrowser)
  const { token, tokenAddress, quantization } = tokenInfo
  const nonce = dvf.util.generateRandomNonce()
  const transferQuantization = new BN(quantization)
  const amountTransfer = new BN(quantizedAmount)

  const expireTime =
    Math.floor(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)
  const starkPublicKey = await dvf.stark.ledger.getPublicKey(path)
  const transport = await Transport.create()
  const eth = new Eth(transport)
  const { address } = await eth.getAddress(path)
  const starkPath = dvf.stark.ledger.getPath(address)

  try {
    await dvf.token.provideContractData(eth, tokenAddress, transferQuantization)
    const starkSignature = await eth.starkSignTransfer_v2(
      starkPath,
      tokenAddress,
      token === 'ETH' ? 'eth' : 'erc20',
      transferQuantization,
      null,
      receiverPublicKey || starkPublicKey.x,
      sourceVault,
      destinationVault,
      amountTransfer,
      nonce,
      expireTime,
      null,
      null
    )
    return { starkPublicKey, nonce, expireTime, starkSignature }
  } finally {
    await transport.close()
  }
}
