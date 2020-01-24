const errorReasons = require('.././../lib/error/reasons')
const sw = require('starkware_crypto')

module.exports = (starkKeyPair, starkMessage) => {
  let starkSignature = ''
  if (!starkKeyPair || !starkMessage) {
    throw 'Stark key pair or stark message missing'
  }
  try {
    starkSignature = sw.sign(starkKeyPair, starkMessage)
  } catch (e) {
    return {
      error: 'ERR_CREATING_STARK_SIGNATURE',
      reason: errorReasons.ERR_CREATING_STARK_SIGNATURE
    }
  }
  return starkSignature
}
