const sw = require('starkware_crypto')
const createPrivateKey = require('./createPrivateKey')
const errorReasons = require('../error/reasons')

module.exports = privateKey => {
  if (!privateKey) {
    privateKey = createPrivateKey()
  }

  try {
    const starkKeyPair = sw.ec.keyFromPrivate(privateKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const starkKey = fullPublicKey.pub.getX().toString('hex')
    return { privateKey, starkKey }
  } catch (e) {
    return {
      error: 'ERR_KEYPAIR_CREATION',
      reason: errorReasons.ERR_KEYPAIR_CREATION
    }
  }
}
