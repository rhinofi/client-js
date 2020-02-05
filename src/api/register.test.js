const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

const sw = require('starkware_crypto')
const _ = require('lodash')

let dvf

describe('dvf.register', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Registers user with Stark Ex', async done => {
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
      .post('/v1/trading/w/register', body => {
        return (
          _.isMatch(body, {
            starkKey: starkPublicKey.x
          }) &&
          body.signature &&
          body.nonce
        )
      })
      .reply(200, apiResponse)

    const result = await dvf.register(starkPublicKey)
    expect(result).toEqual(apiResponse)

    done()
  })

  it('Register method checks for starkKey', async done => {
    const starkPublicKey = ''
    const response = await dvf.register(starkPublicKey)
    expect(response.error).toEqual('ERR_STARK_KEY_MISSING')
    done()
  })
})
