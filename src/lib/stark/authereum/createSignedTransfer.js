const DVFError = require('../../dvf/DVFError')

const address0 = '0x'.padEnd(42, '0')

module.exports = async (
  dvf,
  token,
  amount,
  nonce,
  expirationTimestamp,
  sourceVault,
  destinationVault,
  sourceStarkKey,
  destinationStarkKey,
  conditionalTransferAddress,
  conditionalTransferFact,
  tokenId
) => {
  const starkProvider = dvf.config.starkProvider || null
  if (!starkProvider) {
    throw new DVFError('NO_STARK_PROVIDER')
  }
  const tokenInfo = dvf.token.getTokenInfo(token)
  const amountTransfer = dvf.token.toBaseUnitAmount(token, amount)
  const starkPublicKey = await dvf.stark.authereum.getPublicKey()
  const tokenAddress = token === 'ETH'
    ? address0
    : tokenInfo.tokenAddress

  const signature = await starkProvider.transfer({
    from: {
      vaultId: sourceVault.toString(),
      starkKey: sourceStarkKey
    },
    to: {
      vaultId: destinationVault.toString(),
      starkKey: destinationStarkKey
    },
    asset: {
      type: token === 'ETH' ? 'ETH' : 'ERC20',
      data: {
        quantum: tokenInfo.quantization.toString(),
        tokenAddress,
        tokenId
      }
    },
    amount: amountTransfer,
    nonce: nonce.toString(),
    expirationTimestamp: expirationTimestamp.toString(),
    ...(conditionalTransferFact && conditionalTransferAddress && {
      conditionalTransferAddress: conditionalTransferAddress,
      conditionalTransferFact: `0x${conditionalTransferFact}`
    })
  })

  return {
    starkPublicKey,
    nonce,
    expireTime: expirationTimestamp,
    starkSignature: {r: signature.r.toString('hex'), s: signature.s.toString('hex')},
    signature
  }
}
