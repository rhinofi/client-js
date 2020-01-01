/* eslint-env mocha */
const { assert } = require('chai')
const nock = require('nock')
const mockGetConf = require('./fixtures/nock/get_conf')
const mockGetUserConf = require('./fixtures/nock/get_user_conf')
const mockFeeRate = require('./fixtures/nock/feeRate')
const instance = require('./helpers/instance')
const utils = require('ethereumjs-util')
const sw = require('starkware_crypto')

// TODO: use arrayToOrder to convert response from HTTP API
// const orderToArray = require('lib-js-util-schema')
const ecRecover = require('./helpers/ecRecover')

let efx

before(async () => {
  mockGetConf()
  mockGetUserConf()
  efx = await instance()
})





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

describe('/orderHistory', () => {
  it('OrderHistory request to DVF pub api....', async () => {
    const httpResponse = [
      {
        _id: '5b56333fd952c07b351c5940',
        id: '1151079509',
        type: 'EXCHANGE LIMIT',
        pair: 'ETHUSD',
        status: 'CANCELED',
        created_at: '2018-07-21 16:15:58',
        updated_at: '2018-07-23 19:52:51',
        user_id: 5,
        amount: '-0.10000000',
        price: '10000.00000000',
        originalamount: '-0.10000000',
        routing: 'BFX',
        lockedperiod: 0,
        trailingprice: '0.00000000',
        hidden: 0,
        vir: 0,
        maxrate: '0.00000000000000000000',
        placed_id: null,
        placed_trades: null,
        nopayback: null,
        avg_price: '0.00000000000000000000',
        active: 0,
        fiat_currency: 'USD',
        cid: '58558087372',
        cid_date: '2018-07-21',
        mseq: '2',
        gid: null,
        flags: null,
        price_aux_limit: '0.00000000',
        type_prev: null,
        tif: '3570',
        v_pair: 'ETHUSD',
        meta: { $F15: 1, auth: '0x97ebb3391b30f495ce8cb97857db9b72d3e9dbcb' },
        symbol: 'tETHUSD',
        t: 1532375571000
      },
      {
        _id: '5b56333fd952c07b351c593f',
        id: '1151079508',
        type: 'EXCHANGE LIMIT',
        pair: 'ETHUSD',
        status: 'CANCELED',
        created_at: '2018-07-21 16:15:53',
        updated_at: '2018-07-23 19:52:51',
        user_id: 5,
        amount: '-0.10000000',
        price: '10000.00000000',
        originalamount: '-0.10000000',
        routing: 'BFX',
        lockedperiod: 0,
        trailingprice: '0.00000000',
        hidden: 0,
        vir: 0,
        maxrate: '0.00000000000000000000',
        placed_id: null,
        placed_trades: null,
        nopayback: null,
        avg_price: '0.00000000000000000000',
        active: 0,
        fiat_currency: 'USD',
        cid: '58552546110',
        cid_date: '2018-07-21',
        mseq: '2',
        gid: null,
        flags: null,
        price_aux_limit: '0.00000000',
        type_prev: null,
        tif: '3570',
        v_pair: 'ETHUSD',
        meta: { $F15: 1, auth: '0x97ebb3391b30f495ce8cb97857db9b72d3e9dbcb' },
        symbol: 'tETHUSD',
        t: 1532375571000
      }
    ]

    const nonce = Date.now() / 1000 + ''
    const signature = await efx.sign(nonce.toString(16))

    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/r/orderHistory', body => {
        assert.ok(body.nonce)
        assert.ok(body.signature)
        assert.ok(body.symbol)
        return true
      })
      .reply(200, httpResponse)

    const response = await efx.getOrdersHist('ETHUSD', nonce, signature)
    console.log('got result =>', response)
  })

  it('OrderHistory checks for symbol....', async () => {
    const nonce = Date.now() / 1000 + 60 * 60 * 24 + ''
    const signature = await efx.sign(nonce.toString(16))

    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/r/orderHistory', async body => {
        assert.equal(body.error, 'ERR_INVALID_SYMBOL')
        return true
      })
      .reply(200)
    const response = await efx.getOrdersHist(null, nonce, signature)
    console.log('got result =>', response)
  })
})

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

describe('/others', () => {
  it('GetBalance to dvf pub api....', async () => {
    const apiResponse = { starkBalance: 'success' }

    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/r/getBalance', async body => {
        assert.equal(body.token, 'ETH')
        assert.ok(body.signature)
        return true
      })
      .reply(200, apiResponse)

    const result = await efx.getBalance('ETH')
    console.log('got result for balance =>', result)
  })

  it('GetBalance checks for missing token....', async () => {
    const apiResponse = { starkBalance: 'success' }

    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/r/getBalance', async body => {
        assert.equal(body.error, 'ERR_MISSING_TOKEN')
        return true
      })
      .reply(200, apiResponse)

    const result = await efx.getBalance(null)
    console.log('got result =>', result)
  })

  it('GetBalance checks for invalid token....', async () => {
    const apiResponse = { starkBalance: 'success' }

    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/r/getBalance', async body => {
        assert.equal(body.error, 'ERR_INVALID_TOKEN')
        return true
      })
      .reply(200, apiResponse)

    const result = await efx.getBalance('ETHUSD')
    console.log('got result =>', result)
  })


})
