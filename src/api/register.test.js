const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

const sw = require('starkware_crypto')
const _ = require('lodash')

let dvf

describe('registers', () => {
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
    const starkKey = fullPublicKey.pub.getX().toString('hex')
    console.log({ starkKey })
    console.log('about to call register from test ', { starkKey })
    nock(dvf.config.api)
      .post('/w/register', body => {
        return (
          _.isMatch(body, {
            starkKey: starkKey
          }) &&
          body.signature &&
          body.nonce
        )
      })
      .reply(200, apiResponse)

    const result = await dvf.register(starkKey)
    expect(result).toEqual(apiResponse)

    done()
  })

  it('Register method checks for starkKey', async done => {
    const starkKey = ''
    const response = await dvf.register(starkKey)
    expect(response.error).toEqual('ERR_STARK_KEY_MISSING')
    done()
  })
})
