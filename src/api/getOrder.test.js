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

  it('Gets an order from the API using OrderId....', async done => {
    const apiResponse = [[1234]]

    const nonce = Date.now() / 1000 + 60 * 60 * 24 + ''
    const signature = await dvf.sign(nonce.toString(16))

    nock(dvf.config.api)
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

  it('getOrder checks for orderId....', async done => {
    const order = await dvf.getOrder(null)
    expect(order.error).toEqual('ERR_INVALID_ORDER_ID')
    done()
  })
})
