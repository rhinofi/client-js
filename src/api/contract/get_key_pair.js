const sw = require('starkware_crypto')

module.exports = pvtKey => {
  var keyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
  var publicKey = sw.ec.keyFromPublic(keyPair.getPublic(true, 'hex'), 'hex')
  var starkKey = publicKey.pub.getX().toString()

  return { starkKeyPair: keyPair, publicKey: publicKey, starkKey: starkKey }
}