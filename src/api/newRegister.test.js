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
    const deFiSignature = '0x6B7a66e2e2Eb0F02939b8651b2147c9eF1C079F5'
    nock(dvf.config.api)
      .post('/w/newRegister', body => {
        return (
          _.isMatch(body, {
            starkKey: starkKey
          }) &&
          body.signature &&
          body.nonce
        )
      })
      .reply(200, apiResponse)

    const result = await dvf.newRegister(starkKey, deFiSignature)
    expect(result).toEqual(apiResponse)

    done()
  })

  it('Register method checks for starkKey', async done => {
    const deFiSignature = '0x123'
    const response = await dvf.newRegister(null, deFiSignature)
    expect(response.error).toEqual('ERR_STARK_KEY_MISSING')
    done()
  })

  it('Register method checks for deFiSignature', async done => {
    const starkKey =
      '6d840e6d0ecfcbcfa83c0f704439e16c69383d93f51427feb9a4f2d21fbe075'
    const response = await dvf.newRegister(starkKey, null)
    expect(response.error).toEqual('ERR_SIGNATURE_MISSING')

    done()
  })
})
