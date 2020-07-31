const DVFError = require('../../lib/dvf/DVFError')
const sw = require('starkware_crypto')
const FP = require('lodash/fp')

const sigKeysToString = sig => ({
  r: sig.r.toString(16),
  s: sig.s.toString(16)
})

module.exports = (dvf, starkKeyPair, starkMessage) => {
  let starkSignature

  if (!starkKeyPair || !starkMessage) {
    throw 'Stark key pair or stark message missing'
  }

  try {
    starkSignature = sigKeysToString(
      (dvf.sw || sw).sign(starkKeyPair, starkMessage)
    )
  } catch (e) {
    console.log('/starkSign ', e)
    throw new DVFError('ERR_CREATING_STARK_SIGNATURE')
  }

  return starkSignature
}
