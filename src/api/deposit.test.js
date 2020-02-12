const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

const sw = require('starkware_crypto')
const _ = require('lodash')

let dvf

describe('dvf.deposit', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Deposits ERC20 token to users vault', async () => {
    const amount = 31
    const token = 'ZRX'

    const starkPrivateKey = '100'
    const starkKeyPair = sw.ec.keyFromPrivate(starkPrivateKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const starkPublicKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }

    const apiResponse = {
      token,
      amount,
      starkPublicKey
    }

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit', body => {
        //console.log({ body })
        return (
          _.isMatch(body, apiResponse) &&
          body.starkSignature &&
          body.starkVaultId
        )
      })
      .reply(200, apiResponse)

    const result = await dvf.deposit(token, amount, starkPrivateKey)
    //console.log({ result })
    expect(result).toEqual(apiResponse)
  })

  xit('Deposits ETH to users vault', async () => {
    const amount = 0.01
    const token = 'ETH'

    const starkPrivateKey = '100'
    const starkKeyPair = sw.ec.keyFromPrivate(starkPrivateKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const starkPublicKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }
    const apiResponse = {
      token,
      amount,
      starkPublicKey
    }

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit', body => {
        //console.log({ body })
        return (
          _.isMatch(body, apiResponse) &&
          body.starkSignature &&
          body.starkVaultId
        )
      })
      .reply(200, apiResponse)

    const result = await dvf.deposit(token, amount, starkPrivateKey)
    //console.log({ result })
    expect(result).toEqual(apiResponse)
  })

  it('Gives error for deposit with value of 0', async () => {
    const starkPrivateKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const amount = 0
    const token = 'ZRX'

    try {
      await dvf.deposit(token, amount, starkPrivateKey)

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_AMOUNT_MISSING')
    }
  })

  it('Gives error if token is missing', async () => {
    const starkPrivateKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const amount = 57
    const token = ''

    try {
      await dvf.deposit(token, amount, starkPrivateKey)

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_TOKEN_MISSING')
    }
  })

  it('Gives error if token is not supported', async () => {
    const starkPrivateKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const amount = 57
    const token = 'NOT'

    try {
      await dvf.deposit(token, amount, starkPrivateKey)

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_INVALID_TOKEN')
    }
  })

  it('Gives error if starkPrivateKey is not provided', async () => {
    const starkPrivateKey = ''
    const amount = 57
    const token = 'ZRX'

    try {
      await dvf.deposit(token, amount, starkPrivateKey)

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_STARK_PRIVATE_KEY_MISSING')
    }
  })

  it('Posts to deposit API and gets error response', async () => {
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

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit')
      .reply(422, apiErrorResponse)

    try {
      await dvf.deposit(
        'ZRX',
        31,
        '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
      )
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
    }
  })
})
