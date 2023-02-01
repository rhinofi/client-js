const DVFError = require('../../lib/dvf/DVFError')
const sw = require('@rhino.fi/starkware-crypto')

const sigKeysToString = sig => ({
  r: sig.r.toString(16),
  s: sig.s.toString(16),
  recoveryParam: sig.recoveryParam
})

module.exports = (dvf, tradingKey, nonce) => {
  if (!tradingKey) {
    throw new Error('tradingKey is required')
  }
  if (!nonce) {
    throw new Error('nonce is required')
  }

  try {
    const {starkKeyPair} = dvf.stark.createKeyPair(tradingKey)
    return sigKeysToString(
      (dvf.sw || sw).ec.sign(nonce, starkKeyPair, {canonical: true})
    )
  } catch (error) {
    throw new DVFError('ERR_CREATING_STARK_SIGNATURE', { error })
  }
}
