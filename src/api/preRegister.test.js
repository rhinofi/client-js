const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

const sw = require('starkware_crypto')
const _ = require('lodash')

let dvf

describe('dvf.preRegister', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Pre-registers the starkKey and ethAddress', async () => {
    const apiResponse = { register: 'success' }

    const pvtKey = '100'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )

    const starkPublicKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }

    nock(dvf.config.api)
      .post('/v1/trading/w/preRegister', body => {
        return (
          _.isMatch(body, {
            starkKey: starkPublicKey.x
          }) && body.ethAddress
        )
      })
      .reply(200, apiResponse)

    const response = await dvf.preRegister(starkPublicKey)
    expect(response).toEqual(apiResponse)
  })

  it('Pre-register checks for stark Key', async () => {
    try {
      await dvf.preRegister(null)

      throw new Error('function should throw')
    } catch(error) {
      expect(error.message).toEqual('ERR_STARK_KEY_MISSING')
    }
  })
})
