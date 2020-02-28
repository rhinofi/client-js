const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.cancelOrder', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Posts to cancel order API and gets response', async () => {
    const orderId = '1'
    const apiResponse = { cancelOrder: 'success' }

    const payloadValidator = jest.fn(body => {
      expect(body.orderId).toBe(orderId)
      expect(typeof body.orderId).toBe('string')
      expect(typeof body.nonce).toBe('number')
      expect(typeof body.signature).toBe('string')

      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/cancelOrder', payloadValidator)
      .reply(200, apiResponse)

    const response = await dvf.cancelOrder(orderId)

    expect(payloadValidator).toBeCalled()

    expect(response).toEqual(apiResponse)
  })

  it('Posts to cancel order API and gets error response', async () => {
    const orderId = '1'
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
      .post('/v1/trading/w/cancelOrder', payloadValidator)
      .reply(422, apiErrorResponse)

    try {
      await dvf.cancelOrder(orderId)
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
