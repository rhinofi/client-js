const DVFError = require('../../lib/dvf/DVFError')
const sw = require('starkware_crypto')

module.exports = (starkKeyPair, starkMessage) => {
  let starkSignature = ''

  if (!starkKeyPair || !starkMessage) {
    throw 'Stark key pair or stark message missing'
  }

  try {
    starkSignature = sw.sign(starkKeyPair, starkMessage)
    //console.log('starkSignature ', starkSignature)
  } catch (e) {
    cossole.log('/starkSign ', e)
    throw new DVFError('ERR_CREATING_STARK_SIGNATURE')
  }

  return starkSignature
}
