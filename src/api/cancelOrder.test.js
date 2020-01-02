const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('cancelOrder', () => {

  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
  })

  it('Posts to cancel order API and gets response', async done => {
    const orderId = '1'
    const apiResponse = { cancelOrder: 'success' }

    nock('https://app.stg.deversifi.com/')
      .post('/v1/trading/w/cancelOrder', {
        orderId: orderId
      })
      .reply(200, apiResponse)
    const response = await dvf.cancelOrder(orderId)
    expect(response).toEqual(apiResponse)
    done()
  })

})
