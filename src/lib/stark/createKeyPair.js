const sw = require('starkware_crypto')

const createPrivateKey = require('./createPrivateKey')
const DVFError = require('../dvf/DVFError')
const formatStarkPublicKey = require('./formatStarkPublicKey')

const pubKeysToString = pubKey => ({
  x: pubKey.x.toString(16),
  y: pubKey.y.toString(16)
})

// TODO: copied from starkware-crypto-cpp-node
const hexStringToBigInt = string => string.slice(0, 2) === '0x'
  ? BigInt(string)
  : BigInt('0x' + string)

const castToBigInt = cast => value => typeof value === 'bigint'
  ? value
  : cast(value)

const castHexStringToBigInt = castToBigInt(hexStringToBigInt)

module.exports = (dvf, starkPrivateKey) => {
  if (!starkPrivateKey) {
    starkPrivateKey = createPrivateKey()
  }

  try {
    let starkKeyPair
    let starkPublicKey

    if (dvf.sw && dvf.sw.raw) {
      // This is really only used as a private key to pass to stark.sign
      // which accepts private key as string if sw is defined
      starkKeyPair = starkPrivateKey
      starkPublicKey = formatStarkPublicKey(pubKeysToString(
        dvf.sw.raw.getPublicKey(castHexStringToBigInt(starkPrivateKey))
      ))
    } else {
      starkKeyPair = sw.ec.keyFromPrivate(starkPrivateKey, 'hex')

      const fullPublicKey = sw.ec.keyFromPublic(
        starkKeyPair.getPublic(true, 'hex'),
        'hex'
      )
      const tempKey = {
        x: fullPublicKey.pub.getX().toString('hex'),
        y: fullPublicKey.pub.getY().toString('hex')
      }

      starkPublicKey = formatStarkPublicKey(tempKey)
    }
    return { starkPrivateKey, starkKeyPair, starkPublicKey }
  } catch (originalError) {
    // TODO: use dvf.logger to log the actual error
    throw new DVFError('ERR_PUBLICKEY_CREATION', { originalError })
  }
}
