const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.getOrders', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Queries all orders from public API', async () => {
    const apiResponse = { id: '408231' }

    const payloadValidator = jest.fn(body => {
      expect(body.symbol).toEqual('ETH:USDT')
      expect(typeof body.nonce).toEqual('number')
      expect(typeof body.signature).toEqual('string')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/r/openOrders', payloadValidator)
      .reply(200, apiResponse)

    const response = await dvf.getOrders('ETH:USDT')

    expect(payloadValidator).toBeCalled()
    expect(response.id).toEqual(apiResponse.id)
  })

  it('Posts to open orders API and gets error response', async () => {
    const symbol = 'ETH:USDT'
    const apiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message:
        'Please contact support if you believe there should not be an error here',
      details: {
        error: {
          type: 'DVFError',
          message: 'STARK_ORDER_SIGNATURE_VERIFICATION_FAILED'
        }
      }
    }
    const payloadValidator = jest.fn(() => true)

    nock(dvf.config.api)
      .post('/v1/trading/r/openOrders', payloadValidator)
      .reply(422, apiErrorResponse)

    try {
      await dvf.getOrders(symbol)
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
