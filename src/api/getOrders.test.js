const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('openOrders', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
    await dvf.getUserConfig()
  })

  it('Fetches orders from public API', async done => {
    const apiResponse = { id: '408231' }

    nock(dvf.config.api)
      .post('/v1/trading/r/openOrders', body => {
        console.log('get all orders ', body)
        return (
          _.isMatch(body, {
            symbol: 'ETH:USD'
          }) &&
          body.nonce &&
          body.signature
        )
      })
      .reply(200, apiResponse)

    const response = await dvf.getOrders('ETH:USD')
    expect(response.id).toEqual(apiResponse.id)

    done()
  })

  it('GetOrder checks for orderId....', async done => {
    const orders = await dvf.getOrders(null)
    expect(orders.error).toEqual('ERR_INVALID_SYMBOL')

    done()
  })
})
