const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('cancelOrder', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Posts to cancel order API and gets response', async () => {
    const orderId = '1'
    const apiResponse = {cancelOrder: 'success'}
    
    const payloadValidator = jest.fn((body) => {
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

  
})
