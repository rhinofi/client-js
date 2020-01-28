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

  it('gets an order from the API using OrderId....', async done => {
    const apiResponse = [[1234]]

    nock(dvf.config.api)
      .post('/v1/trading/r/getOrder', body => {
        //console.log('singe order ', body)
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
