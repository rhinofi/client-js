const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

const sw = require('starkware_crypto')
const _ = require('lodash')

let dvf

describe('dvf.withdraw', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it(`Withdraws ERC20 token to user's vault`, async () => {
    const starkPrivateKey = '100'
    const amount = '12'
    const token = 'USDT'
    const starkPublicKey = {
      x: '06d840e6d0ecfcbcfa83c0f704439e16c69383d93f51427feb9a4f2d21fbe075',
      y: '58f7ce5eb6eb5bd24f70394622b1f4d2c54ebca317a3e61bf9f349dccf166cf'
    }

    const apiResponse = {
      token,
      amount,
      starkPublicKey
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(apiResponse)
      expect(typeof body.nonce).toBe('number')
      expect(body.starkSignature.r).toMatch(/[\da-f]/i)
      expect(body.starkSignature.s).toMatch(/[\da-f]/i)
      expect(body.starkSignature.recoveryParam).toBeLessThan(5)
      expect(typeof body.starkVaultId).toBe('number')
      expect(typeof body.expireTime).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/withdraw', payloadValidator)
      .reply(200, apiResponse)

    await dvf.withdraw(token, amount, starkPrivateKey)

    expect(payloadValidator).toBeCalled()
  })

  it('Withdraws ETH to users vault', async () => {
    const starkPrivateKey = '100'
    const token = 'ETH'
    const amount = '1.117'
    const apiResponse = {
      token,
      amount,
      starkPublicKey: {
        x: '06d840e6d0ecfcbcfa83c0f704439e16c69383d93f51427feb9a4f2d21fbe075',
        y: '58f7ce5eb6eb5bd24f70394622b1f4d2c54ebca317a3e61bf9f349dccf166cf'
      }
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(apiResponse)
      expect(typeof body.nonce).toBe('number')
      expect(body.starkSignature.r).toMatch(/[\da-f]/i)
      expect(body.starkSignature.s).toMatch(/[\da-f]/i)
      expect(body.starkSignature.recoveryParam).toBeLessThan(5)
      expect(typeof body.starkVaultId).toBe('number')
      expect(typeof body.expireTime).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/withdraw', payloadValidator)
      .reply(200, apiResponse)

    await dvf.withdraw(token, amount, starkPrivateKey)

    expect(payloadValidator).toBeCalled()
  })

  it('Gives error for withdrawal with value of 0', async () => {
    const starkPrivateKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const amount = 0
    const token = 'ZRX'

    try {
      await dvf.withdraw(token, amount, starkPrivateKey)

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
      await dvf.withdraw(token, amount, starkPrivateKey)

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
      await dvf.withdraw(token, amount, starkPrivateKey)

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
      await dvf.withdraw(token, amount, starkPrivateKey)

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_STARK_PRIVATE_KEY_MISSING')
    }
  })

  it('Posts to withdrawal API and gets error response', async () => {
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
      .post('/v1/trading/w/withdraw')
      .reply(422, apiErrorResponse)

    try {
      await dvf.withdraw(
        'ZRX',
        31,
        '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
      )
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
    }
  })
})
