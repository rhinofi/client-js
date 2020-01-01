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
  })

// TODO:
/*

describe('/getOrder', () => {
  it('GetOrder request to DVF pub api....', async () => {
    const orderId = 1
    const apiResponse = [[1234]]
    const nonce = Date.now() / 1000 + 30 + ''
    const signature = await efx.sign(nonce.toString(16))

    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/r/getOrder', async body => {
        assert.equal(body.orderId, orderId)
        assert.equal(body.nonce, nonce)
        assert.equal(body.signature, signature)
        return true
      })
      .reply(200, apiResponse)
    const response = await efx.getOrder(orderId, nonce, signature)
    console.log('got result =>', response)
  })

  it('GetOrder checks for orderId....', async () => {
    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/r/getOrder', async body => {
        assert.equal(body.error, 'ERR_INVALID_ORDER_ID')
        return true
      })
      .reply(200)
    const response = await efx.getOrder('', '', '')
    console.log('got result =>', response)
  })
})

*/

})
