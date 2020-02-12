const errorReasons = require('../../lib/dvf/DVFError')
const sw = require('starkware_crypto')

module.exports = (starkKeyPair, starkMessage) => {
  let starkSignature = ''

  if (!starkKeyPair || !starkMessage) {
    throw 'Stark key pair or stark message missing'
  }

  try {
    tempSignature = sw.sign(starkKeyPair, starkMessage)
    starkSignature = {
      r: '0x' + tempSignature.r,
      w: '0x' + tempSignature.s.invm(sw.ec.n)
    }
    console.log('tempSignature, starkSignature ', tempSignature, starkSignature)
  } catch (e) {
    return {
      error: 'ERR_CREATING_STARK_SIGNATURE',
      reason: errorReasons.ERR_CREATING_STARK_SIGNATURE
    }
  }

  return starkSignature
}
