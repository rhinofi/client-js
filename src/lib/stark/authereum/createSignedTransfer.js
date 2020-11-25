const DVFError = require('../../dvf/DVFError')
const BN = require('bignumber.js')

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
  const amountTransfer = new BN(dvf.token.toQuantizedAmount(token, amount))
  const starkPublicKey = await starkProvider.getStarkKey()
  const expireTime = Math.floor(Date.now() / (1000 * 3600)) + parseInt(dvf.config.defaultStarkExpiry)

  const starkSignature = await starkProvider.transfer({
    from: {
      vaultId: sourceVault
    },
    to: {
      vaultId: destinationVault,
      starkKey: starkPublicKey
    },
    asset: {
      type: token === 'ETH' ? 'ETH' : 'ERC20',
      data: {
        quantum: quantization,
        tokenAddress
      }
    },
    amount,
    nonce,
    expirationTimestamp: expireTime,
    condition: null
  })
  return { starkPublicKey, nonce, expireTime, starkSignature }
}
