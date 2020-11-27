const DVFError = require('../../dvf/DVFError')

module.exports = async (
  dvf,
  token,
  amount,
  sourceVault,
  destinationVault
) => {
  const starkProvider = dvf.config.starkProvider || null
  if (!starkProvider) {
    throw new DVFError('NO_STARK_PROVIDER')
  }
  const {tokenAddress, quantization} = dvf.token.getTokenInfo(token)
  const nonce = dvf.util.generateRandomNonce()
  const amountTransfer = dvf.token.toBaseUnitAmount(token, amount)
  const starkPublicKey = await dvf.stark.authereum.getPublicKey()
  const expireTime = Math.floor(Date.now() / (1000 * 3600)) + parseInt(dvf.config.defaultStarkExpiry)

  const {r, s} = await starkProvider.transfer({
    from: {
      vaultId: sourceVault.toString()
    },
    to: {
      vaultId: destinationVault.toString(),
      starkKey: `0x${starkPublicKey.x}`
    },
    asset: {
      type: token === 'ETH' ? 'ETH' : 'ERC20',
      data: {
        quantum: quantization.toString(),
        tokenAddress
      }
    },
    amount: amountTransfer,
    nonce: nonce.toString(),
    expirationTimestamp: expireTime.toString(),
    condition: null
  })

  return {
    starkPublicKey,
    nonce,
    expireTime,
    starkSignature: {r: r.toString('hex'), s: s.toString('hex')}
  }
}
