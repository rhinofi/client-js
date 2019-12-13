/* eslint-env mocha */

const { assert } = require('chai')
const nock = require('nock')
const mockGetConf = require('./fixtures/nock/get_conf')
const mockFeeRate = require('./fixtures/nock/feeRate')
const instance = require('./helpers/instance')
const utils = require('ethereumjs-util')

// TODO: use arrayToOrder to convert response from HTTP API
// const orderToArray = require('lib-js-util-schema')

let efx

before(async () => {
  mockGetConf()
  efx = await instance()
})

describe('StarkEX deposit suite....', () => {
  // 1st test_case
  it('dvf pub api deposit....(1)', async () => {
    const apiResponse = { starkDeposit: 'success' }

    nock('https://staging-api.deversifi.com/')
      .post('/v1/stark/deposit', async body => {
        console.log('body: ', body)
        assert.equal(body.userAddress, '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404')
        assert.equal(
          body.starkKey,
          '3382153814239323293087870650452838988136913683747955644970514321018482846275'
        )
        assert.equal(body.tempVaultId, '1')
        assert.equal(body.vaultId, '2')
        assert.equal(body.tokenId, '12345')
        assert.equal(body.amount, '100')
        assert.ok(body.starkSignature)
        return true
      })
      .reply(200, apiResponse)

    const result = await efx.deposit(
      'NEC', // token
      100 // amount
    )
    console.log('got result =>', result)
  })
  // 2nd test_case
  it('dvf pub api deposit....(2)', async () => {
    // variables
    const token = 'NEC',
      amount = 20
    // linking url with nock
    nock('https://staging-api.deversifi.com/')
      .post('/v1/stark/deposit', body => {
        console.log('body: ', body)
        assert.equal(body.userAddress, '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404')
        assert.equal(
          body.starkKey,
          '3382153814239323293087870650452838988136913683747955644970514321018482846275'
        )
        assert.equal(body.tempVaultId, '1')
        assert.equal(body.vaultId, '2')
        assert.equal(body.tokenId, '12345')
        assert.equal(body.amount, '20')
        assert.ok(body.starkSignature)
        return true
      })
      .reply(200, (url, requestBody) => {
        console.log('url: ', url, ' \nrequestBody: ', requestBody)
        console.log('successfully deposited!!!')
      })
    const result = await efx.deposit(token, amount)
  })

  it('dvf pub api submit order....', async () => {
    const apiResponse = { starkSubmitOrder: 'success' }

    nock('https://staging-api.deversifi.com/')
      .post('/v1/stark/submitOrder', async body => {
        console.log(`body: ${body}`, body)
        assert.equal(body.meta.userAddress, '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404')
        assert.equal(
          body.meta.starkKey,
          '3382153814239323293087870650452838988136913683747955644970514321018482846275'
        )
        assert.ok(body.meta.starkSignature)

        return true
      })
      .reply(200, apiResponse)

    const result = await efx.submitOrder(
      'ZRXUSD', // symbol
      100, // amount
      10, // price
      1, // gid
      1, // cid
      '0x1', // signedOrder
      300, // validFor
      3, // partnerId
      400.023, // feeRate
      200, // dynamicFeeRate
      227, // vaultIdBuy
      221 // vaultIdSell
    )

    console.log('got result =>', result)
  })

  it('dvf pub api getBalance....', async () => {
    const apiResponse = { starkBalance: 'success' }

    nock('https://staging-api.deversifi.com/')
      .post('/v1/stark/getBalance', async body => {
        console.log(`body: ${body}`, body)
        assert.equal(body.userAddress, '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404')
        assert.equal(body.token, 'NEC')
        assert.equal(
          body.starkKey,
          '3382153814239323293087870650452838988136913683747955644970514321018482846275'
        )
        return true
      })
      .reply(200, apiResponse)

    const result = await efx.getBalance('NEC')
    console.log('got result =>', result)
  })

  it('dvf pub api cancelOrder....', async () => {
    const orderId = 1
    const signedOrder = await efx.sign.cancelOrder(orderId)
    const apiResponse = [1234]

    nock('https://staging-api.deversifi.com/')
      .post('/v1/stark/cancelOrder', async body => {
        console.log('body: ', body)
        assert.equal(body.orderId, orderId)
        return true
      })
      .reply(200, apiResponse)

    const response = await efx.cancelOrder(orderId)
    console.log('response: ', response)
    assert.deepEqual(response, apiResponse)
  })

  it('dvf pub api getOrder....', async () => {
    const orderId = 1
    const apiResponse = [[1234]]

    nock('https://staging-api.deversifi.com/')
      .post('/v1/stark/getOrders', async body => {
        assert.equal(body.id, orderId)
        assert.equal(body.protocol, '0x')
        assert.ok(body.nonce)
        assert.ok(body.signature)
        return true
      })
      .reply(200, apiResponse)
    const response = await efx.getOrder(orderId)
    console.log('getOrder response: ', response)
    assert.deepEqual(response, apiResponse)
  })

  it('dvf pub api getOrders....', async () => {
    const apiResponse = [[1234], [1235]]

    nock('https://staging-api.deversifi.com/')
      .post('/v1/stark/getOrders', async body => {
        assert.equal(body.protocol, '0x')
        assert.ok(body.nonce)
        assert.ok(body.signature)
        return true
      })
      .reply(200, apiResponse)
    const response = await efx.getOrders()
    console.log('getOrder response: ', response)
    assert.deepEqual(response, apiResponse)
  })

  it('dvf pub api submit buy order....', async () => {
    const apiResponse = { starkSubmitOrder: 'success' }

    nock('https://staging-api.deversifi.com/')
      .post('/v1/stark/submitOrder', async body => {
        console.log(`body: ${body}`, body)
        assert.equal(body.userAddress, '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404')
        assert.equal(body.order.nonce, 0)
        assert.equal(
          body.meta.starkKey,
          '3382153814239323293087870650452838988136913683747955644970514321018482846275'
        )
        assert.ok(body.meta.starkSignature)
        return true
      })
      .reply(200, apiResponse)

    const result = await efx.submitBuyOrder(
      'ZRXUSD', // symbol
      100, // amount
      10, // price
      1, // gid
      1, // cid
      '0x1', // signedOrder
      300, // validFor
      3, // partnerId
      400.023, // feeRate
      200, // dynamicFeeRate
      227, // vaultIdBuy
      221 // vaultIdSell
    )

    console.log('got result =>', result)
  })

  it('dvf pub api submit sell order....', async () => {
    const apiResponse = { starkSubmitOrder: 'success' }
    nock('https://staging-api.deversifi.com/')
      .post('/v1/stark/submitOrder', async body => {
        console.log(`body: ${body}`, body)
        assert.equal(body.meta.userAddress, '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404')
        assert.equal(
          body.meta.starkKey,
          '3382153814239323293087870650452838988136913683747955644970514321018482846275'
        )
        assert.ok(body.meta.starkSignature)
        return true
      })
      .reply(200, apiResponse)

    const result = await efx.submitSellOrder(
      'ZRXUSD', // symbol
      100, // amount
      10, // price
      1, // gid
      1, // cid
      '0x1', // signedOrder
      300, // validFor
      3, // partnerId
      400.023, // feeRate
      200, // dynamicFeeRate
      227, // vaultIdBuy
      221 // vaultIdSell
    )

    console.log('got result =>', result)
  })

  it('dvf pub api getOrdersHist....', async () => {
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

    nock('https://staging-api.deversifi.com/')
      .post('/v1/stark/getOrders/hist', body => {
        console.log('body: ', body)
        assert.equal(body.protocol, '0x')
        assert.ok(body.nonce)
        assert.ok(body.signature)
        return true
      })
      .reply(200, httpResponse)

    const response = await efx.getOrdersHist(null, (nonce = 0))
    console.log('getOrderHist response: ', httpResponse)
    assert.deepEqual(response, httpResponse)
  })
  return
  it('dvf pub api feeRate....', async () => {
    const httpResponse = {
      address: '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404',
      timestamp: 1568959208939,
      fees: {
        small: { threshold: 0, feeBps: 25 },
        medium: { threshold: 500, feeBps: 21 },
        large: { threshold: 2000, feeBps: 20 }
      },
      signature:
				'0x52f18b47494e465aa4ed0f0f123fae4d40d3ac0862b61862e6cc8e5a119dbfe1061a4ee381092a10350185071f4829dbfd6c5f2e26df76dee0593cbe3cbd87321b'
    }

    nock('https://staging-api.deversifi.com/')
      .get('/v1/stark/feeRate/' + '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404')
      .reply(200, httpResponse)

    const symbol = 'MKRETH'
    const amount = -5
    const price = 2.5

    const response = await efx.getFeeRate(symbol, amount, price)
    console.log('Response: ', response)
    assert.equal(response.feeRate.threshold, 500)
    assert.equal(response.feeRate.feeBps, 21)
    assert.deepEqual(response.feeRates.fees, httpResponse.fees)
  })
})
