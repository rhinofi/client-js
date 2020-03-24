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
    const preRegisterResponse = {
      deFiSignature:
        '0xd22fde0d6b71845dea3476bcc3e1806f9278b4c586d894ee8e2653b74946ee367912412d176bb78382658ac3762ba7fa59640efc45ca3bc34c55955f00b5061c1c'
    }
    mockGetConf()

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
      .reply(200, preRegisterResponse)

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
  })

  it('Register method checks for starkKey', async () => {
    const starkPublicKey = ''
    const deFiSignature = '0xa1b2c3'

    try {
      await dvf.register(starkPublicKey)

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_STARK_KEY_MISSING')
    }
  })

  it('Posts to register config API and gets error response', async () => {
    const starkPublicKey = {
      x: '0x12345',
      y: '0x12345'
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

    const preRegisterResponse = {
      deFiSignature:
        '0xd22fde0d6b71845dea3476bcc3e1806f9278b4c586d894ee8e2653b74946ee367912412d176bb78382658ac3762ba7fa59640efc45ca3bc34c55955f00b5061c1c'
    }

    nock(dvf.config.api)
      .post('/v1/trading/w/preRegister', body => {
        return (
          _.isMatch(body, {
            starkKey: starkPublicKey.x
          }) && body.ethAddress
        )
      })
      .reply(200, apiErrorResponse)

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
