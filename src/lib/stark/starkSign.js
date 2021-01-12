const DVFError = require('../../lib/dvf/DVFError')
const sw = require('starkware_crypto')

const sigKeysToString = sig => ({
  r: sig.r.toString(16),
  s: sig.s.toString(16)
})

module.exports = (dvf, starkKeyPair, starkMessage) => {
  let starkSignature

  if (!starkKeyPair) {
    throw new Error('starkKeyPair is required')
  }
  if (!starkMessage) {
    throw new Error('starkMessage required')
  }

  try {
    starkSignature = sigKeysToString(
      (dvf.sw || sw).sign(starkKeyPair, starkMessage)
    )
  } catch (error) {
    throw new DVFError('ERR_CREATING_STARK_SIGNATURE', { error })
  }

  return starkSignature
}
