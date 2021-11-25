const nock = require('nock')
const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.deposit', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it.skip(`Deposits ERC20 token to user's vault`, async () => {
    mockGetConf()
    const starkPrivateKey = '100'
    const amount = '1394.0000051'
    const token = 'USDT'
    const starkPublicKey = {
      x: '06d840e6d0ecfcbcfa83c0f704439e16c69383d93f51427feb9a4f2d21fbe075',
      y: '58f7ce5eb6eb5bd24f70394622b1f4d2c54ebca317a3e61bf9f349dccf166cf'
    }

    const apiResponse = {
      token,
      // Amount for USDT is quantised to 6 decimals, rounded down
      amount: '1394.000005',
      starkPublicKey
    }

    const payloadValidator = jest.fn((body) => {
      expect(body).toMatchObject(apiResponse)
      expect(typeof body.nonce).toBe('number')
      expect(body.starkSignature.r).toMatch(/[\da-f]/i)
      expect(body.starkSignature.s).toMatch(/[\da-f]/i)
      expect(typeof body.starkVaultId).toBe('number')
      expect(typeof body.expireTime).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit', payloadValidator)
      .reply(200, apiResponse)

    await dvf.deposit(token, amount, starkPrivateKey)

    expect(payloadValidator).toBeCalled()
  })

  it.skip('Deposits ETH to users vault', async () => {
    mockGetConf()
    const starkPrivateKey = '100'
    const token = 'ETH'

    const amount = '1.1177777777'
    const apiResponse = {
      token,
      // Amount for ETH is quantised to 8 decimals, rounded down
      amount: '1.11777777',
      starkPublicKey: {
        x: '06d840e6d0ecfcbcfa83c0f704439e16c69383d93f51427feb9a4f2d21fbe075',
        y: '58f7ce5eb6eb5bd24f70394622b1f4d2c54ebca317a3e61bf9f349dccf166cf'
      }
    }

    const payloadValidator = jest.fn((body) => {
      expect(body).toMatchObject(apiResponse)
      expect(typeof body.nonce).toBe('number')
      expect(body.starkSignature.r).toMatch(/[\da-f]/i)
      expect(body.starkSignature.s).toMatch(/[\da-f]/i)
      expect(typeof body.starkVaultId).toBe('number')
      expect(typeof body.expireTime).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit', payloadValidator)
      .reply(200, apiResponse)

    await dvf.deposit(token, amount, starkPrivateKey)

    expect(payloadValidator).toBeCalled()
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
    const amount = '57'
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
    const amount = '57'
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
    const amount = '57'
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
