const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('dvf.getOrder', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
    await dvf.getUserConfig()
  })

  it('Posts to get order API and gets response', async () => {
    const orderId = '1'
    const apiResponse = { cancelOrder: 'success' }

    const payloadValidator = jest.fn(body => {
      expect(body.orderId).toBe(orderId)
      expect(typeof body.orderId).toBe('string')

      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/r/getOrder', payloadValidator)
      .reply(200, apiResponse)

    const response = await dvf.getOrder(orderId)

    expect(payloadValidator).toBeCalled()

    expect(response).toEqual(apiResponse)
  })

  it('getOrder checks for orderId....', async () => {
    try {
      await dvf.getOrder(null)

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_INVALID_ORDER_ID')
    }
  })

  it('Posts to get order API and gets error response', async () => {
    const apiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message:
        'Please contact support if you believe there should not be an error here',
      details: {
        error: {
          type: 'DVFError',
          message: 'STARK_ORDER_VERIFICATION_ERROR'
        }
      }
    }
    const orderId = 1
    const payloadValidator = jest.fn(() => true)

    nock(dvf.config.api)
      .post('/v1/trading/r/getOrder', payloadValidator)
      .reply(422, apiErrorResponse)

    try {
      await dvf.getOrder(orderId)
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
