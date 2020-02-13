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

  it('Registers user with Stark Ex', async () => {
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
    const deFiSignature =
      '0xb5c3802c7cd4a6832c65b35f7011640ab4307f2109451f3db26f2ccf81639e756b109d63dade93ea7f879c735a11b4a0a6671e308a70b106639b15d43f001aac1c'
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

    const result = await dvf.register(starkPublicKey, deFiSignature)
    expect(result).toEqual(apiResponse)
  })

  it('Register method checks for starkKey', async () => {
    const starkPublicKey = ''
    const deFiSignature = '0xa1b2c3'

    try {
      await dvf.register(starkPublicKey, deFiSignature)

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_STARK_KEY_MISSING')
    }
  })

  it('Posts to pre register config API and gets error response', async () => {
    const apiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message:
        'Please contact support if you believe there should not be an error here',
      details: {
        error: {
          type: 'DVFError',
          message: 'MUST_REGISTER'
        }
      }
    }

    const payloadValidator = jest.fn(() => true)

    nock(dvf.config.api)
      .post('/v1/trading/w/register', payloadValidator)
      .reply(422, apiErrorResponse)

    try {
      await dvf.register('0x')
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
