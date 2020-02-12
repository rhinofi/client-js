const errorReasons = require('../../lib/dvf/DVFError')
const sw = require('starkware_crypto')

module.exports = (starkKeyPair, starkMessage) => {
  let starkSignature = ''

  if (!starkKeyPair || !starkMessage) {
    throw 'Stark key pair or stark message missing'
  }

  try {
    starkSignature = sw.sign(starkKeyPair, starkMessage)
    //console.log('stark Signature ', starkSignature)
  } catch (e) {
    return {
      error: 'ERR_CREATING_STARK_SIGNATURE',
      reason: errorReasons.ERR_CREATING_STARK_SIGNATURE
    }
  }
  
  return starkSignature
}
