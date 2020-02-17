const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.withdraw', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it(`posts user's withdrawal request`, async () => {
    const token = 'ZRX'
    const amount = 100

    const apiResponse = { ok: true }

    const payloadValidator = jest.fn(body => {
      expect(body.token).toEqual(token)
      expect(body.amount).toEqual(amount)

      expect(typeof body.nonce).toBe('number')
      expect(typeof body.signature).toBe('string')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/withdraw', payloadValidator)
      .reply(200, apiResponse)

    const result = await dvf.withdraw(token, amount)

    expect(payloadValidator).toBeCalled()
    expect(result).toEqual(apiResponse)
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
          message: 'STARK_SIGNATURE_VERIFICATION_ERROR'
        }
      }
    }

    const payloadValidator = jest.fn(() => true)

    nock(dvf.config.api)
      .post('/v1/trading/w/withdraw', payloadValidator)
      .reply(422, apiErrorResponse)

    try {
      await dvf.withdraw('ETH', 1)
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
