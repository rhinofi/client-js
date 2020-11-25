const DVFError = require('../../dvf/DVFError')
const sw = require('starkware_crypto')

module.exports = async (dvf) => {
  const starkProvider = dvf.config.starkProvider || null
  if (!starkProvider) {
    throw new DVFError('NO_STARK_PROVIDER')
  }
  const authereumPublicKey = await starkProvider.getPublicKey()
  const fullPublicKey = sw.ec.keyFromPublic(
    authereumPublicKey,
    'hex'
  )
  const tempKey = {
    x: fullPublicKey.pub.getX().toString('hex'),
    y: fullPublicKey.pub.getY().toString('hex')
  }

  return dvf.stark.formatStarkPublicKey(tempKey)
}
