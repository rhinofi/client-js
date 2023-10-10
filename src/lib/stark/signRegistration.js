const DVFError = require('../dvf/DVFError')
const sw = require('@rhino.fi/starkware-crypto')

const pad = (rec) => rec.padStart(64, 0)
const removePrefix = (input) => input.replace(/^0x/, '')

/**
 * @type {(dvf: ReturnType<import('../dvf/bindApi')>,
 * tradingKey: string,
 * ethAddress: string) => Promise<string>}
 */
module.exports = async (dvf, ethAddress) => {
  const { dvfStarkProvider } = dvf
  const publicKey = await dvfStarkProvider.getPublicKey()

  const message = dvf.stark.createRegistrationMessage(`0x${pad(publicKey.x)}`, ethAddress)

  try {
    const { r, s } = await dvfStarkProvider.sign(message)

    const components = [
      r.toString(16),
      s.toString(16),
      publicKey.y
    ]
      .map(removePrefix)
      .map(pad)

    const final = `0x${components.join('')}`

    return final
  } catch (error) {
    throw new DVFError('ERR_CREATING_STARK_REGISTRATION_SIGNATURE', { error })
  }
}
