const DVFError = require('../dvf/DVFError')
const sw = require('@rhino.fi/starkware-crypto')

const pad = (rec) => rec.padStart(64, 0)

/**
 * @type {(dvf: ReturnType<import('../dvf/bindApi')>,
 * tradingKey: string,
 * ethAddress: string) => Promise<string>}
 */
module.exports = async (dvf, tradingKey, ethAddress) => {
  const starkware = dvf.sw || sw
  if (!tradingKey) {
    throw new Error('tradingKey is required')
  }

  /*
  uint256 msgHash = uint256(
      keccak256(abi.encodePacked("UserRegistration:", ethKey, starkKey))
  ) % ECDSA.EC_ORDER;
  */

  const { dvfStarkProvider } = dvf
  const publicKey = await dvfStarkProvider.getPublicKey()

  const message = dvf.stark.createRegistrationMessage(`0x${pad(publicKey.x)}`, ethAddress)

  try {
    const { starkKeyPair } = dvf.stark.createKeyPair(tradingKey)

    const { r, s } = starkware.sign(starkKeyPair, message)

    const components = [
      r.toString(16),
      s.toString(16),
      publicKey.y
    ].map(pad)

    const final = `0x${components.join('')}`

    return final
  } catch (error) {
    throw new DVFError('ERR_CREATING_STARK_REGISTRATION_SIGNATURE', { error })
  }
}
