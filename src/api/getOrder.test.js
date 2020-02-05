const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('getOrder', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
    await dvf.getUserConfig()
  })

  it('Posts to get order API and gets response', async () => {
    const orderId = '1'
    const apiResponse = {cancelOrder: 'success'}
    
    const payloadValidator = jest.fn((body) => {
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

  it('getOrder checks for orderId....', async done => {
    const order = await dvf.getOrder(null)
    expect(order.error).toEqual('ERR_INVALID_ORDER_ID')
    done()
  })
})
