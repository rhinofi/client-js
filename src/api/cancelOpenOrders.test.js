const nock = require('nock')
const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')

describe('dvf.cancelOrder', () => {
  let dvf
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  const mockApi = (apiResponse, payloadValidator, status = 200) => nock(dvf.config.api)
    .post('/v1/trading/w/cancelOpenOrders', payloadValidator)
    .reply(status, apiResponse)

  it('Posts to cancel order API and gets response', async () => {
    const apiResponse = [{ orderId: '1', canceled: true, active: true }]

    const payloadValidator = jest.fn((payload) => {
      expect(typeof payload.nonce).toBe('string')
      expect(typeof payload.signature).toBe('string')

      return true
    })

    mockApi(apiResponse, payloadValidator)

    const response = await dvf.cancelOpenOrders()

    expect(payloadValidator).toBeCalled()

    expect(response).toEqual(apiResponse)
  })

  it('Posts to cancel order API and gets error response', async () => {
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

    mockApi(apiErrorResponse, payloadValidator, 422)

    try {
      await dvf.cancelOpenOrders()
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
