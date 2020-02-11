const sw = require('starkware_crypto')
const createPrivateKey = require('./createPrivateKey')
const errorReasons = require('../../lib/dvf/DVFError')

// QUESTION: remove async from function and make privateKey mandatory?
module.exports = (privateKey) => {
  if (!privateKey) {
    privateKey = createPrivateKey()
  }

  try {
    const starkKeyPair = sw.ec.keyFromPrivate(privateKey, 'hex')

    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const starkPublicKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }

    return {privateKey, starkKeyPair, starkPublicKey}
  } catch (e) {
    return {
      error: 'ERR_PUBLICKEY_CREATION',
      reason: errorReasons.ERR_PUBLICKEY_CREATION
    }
  }
}
