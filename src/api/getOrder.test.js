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

// TODO:
/*

describe('/openOrders', () => {
  it('openOrders posts to DVF Pub Api....', async () => {
    const apiResponse = [[1234]]

    const nonce = Date.now() / 1000 + 60 * 60 * 24 + ''
    const signature = await efx.sign(nonce.toString(16))

    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/r/openOrders', body => {
        assert.ok(body.nonce)
        assert.ok(body.signature)
        assert.ok(body.symbol)
        return true
      })
      .reply(200, apiResponse)

    const response = await efx.getOrders('ETHUSD', nonce, signature)
    console.log('got result =>', response)
    assert.deepEqual(response, apiResponse)
  })

  it('OpenOrders checks for symbol....', async () => {
    const nonce = Date.now() / 1000 + 60 * 60 * 24 + ''
    const signature = await efx.sign(nonce.toString(16))

    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/r/openOrders', async body => {
        assert.equal(body.error, 'ERR_INVALID_SYMBOL')
        return true
      })
      .reply(200)
    const response = await efx.getOrders(null, nonce, signature)
    console.log('got result =>', response)
  })
})

*/

})
