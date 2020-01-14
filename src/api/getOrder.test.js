const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('getOrders', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
  })

  describe('/openOrders', () => {
    it('openOrders posts to DVF Pub Api....', async done => {
      const apiResponse = [[1234]]

      const nonce = Date.now() / 1000 + 60 * 60 * 24 + ''
      const signature = await dvf.sign(nonce.toString(16))

      nock('https://app.stg.deversifi.com/')
        .post('/v1/trading/r/getOrder', body => {
          return (
            _.isMatch(body, {
              orderId: '123'
            }) &&
            body.signature &&
            body.nonce
          )
        })
        .reply(200, apiResponse)

      const order = await dvf.getOrder('123')
      expect(order).toEqual(apiResponse)

      done()
    })

    it('OpenOrders checks for orderId....', async done => {
      const order = await dvf.getOrder(null)
      expect(order.error).toEqual('ERR_INVALID_ORDER_ID')
      done()
    })
  })
})
