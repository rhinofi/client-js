const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

const sw = require('@rhino.fi/starkware-crypto')
const _ = require('lodash')

let dvf

describe('dvf.register', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it.skip('Registers user with Stark Ex', async () => {
    const apiResponse = {
      isRegistered: true
    }

    mockGetConf()

    const pvtKey = '100'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const tempKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }

    const starkPublicKey = dvf.stark.formatStarkPublicKey(tempKey)

    nock(dvf.config.api)
      .post('/v1/trading/w/register', (body) => {
        return (
          _.isMatch(body, {
            tradingKey: starkPublicKey.x
          }) &&
          body.signature &&
          body.nonce
        )
      })
      .reply(200, apiResponse)

    const result = await dvf.register(starkPublicKey)

    expect(result).toEqual(apiResponse)
  })

  it.skip('Register method accepts nonce and signature', async () => {
    const apiResponse = {
      isRegistered: true
    }

    mockGetConf()

    const nonce = Date.now() / 1000 + ''
    const signature = await dvf.sign(nonce.toString(16))

    const pvtKey = '100'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const tempKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }

    const starkPublicKey = dvf.stark.formatStarkPublicKey(tempKey)

    nock(dvf.config.api)
      .post('/v1/trading/w/register', (body) => {
        return (
          _.isMatch(body, {
            tradingKey: starkPublicKey.x
          }) &&
          body.signature &&
          body.nonce
        )
      })
      .reply(200, apiResponse)

    const result = await dvf.register(starkPublicKey, nonce, signature)

    expect(result).toEqual(apiResponse)
  })

  it('Register method checks for tradingKey', async () => {
    const starkPublicKey = ''

    try {
      await dvf.register(starkPublicKey)

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_STARK_KEY_MISSING')
      expect(error.reason).toEqual('Trading key not provided')
    }
  })

  it('Posts to register config API and gets error response', async () => {
    const starkPublicKey = {
      x: 'a1b2345',
      y: 'b1c2345'
    }
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
      await dvf.register(starkPublicKey)
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
