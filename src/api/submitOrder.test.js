const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

const sw = require('starkware_crypto')
const _ = require('lodash')

let dvf

describe('submitOrder', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
    await dvf.getUserConfig()
  })

  it('Submits buy order and receives response', async done => {
    const apiResponse = { id: '408231' }
    const starkPrivateKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    nock(dvf.config.api)
      .post('/v1/trading/w/submitOrder', body => {
        return _.matches({
          type: 'EXCHANGE LIMIT',
          symbol: 'ETH:USDT',
          amount: '0.1',
          price: 1000,
          meta: {
            ethAddress: '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404',
            starkKey:
              '77a3b314db07c45076d11f62b6f9e748a39790441823307743cf00d6597ea43'
          }
        })
      })
      .reply(200, apiResponse)

    const response = await dvf.submitOrder(
      'ETH:USDT', // symbol
      '0.1', // amount
      1000, // price
      '', // gid
      '', // cid
      '0', // signedOrder
      '0', // validFor
      '', // partnerId
      '', // feeRate
      '', // dynamicFeeRate
      starkPrivateKey
    )
    expect(response.id).toEqual(apiResponse.id)

    done()
  })

  it('Submits sell order and receives response', async done => {
    const apiResponse = { id: '408231' }

    // User Specific Parameters
    const starkPrivateKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'

    nock(dvf.config.api)
      .post('/v1/trading/w/submitOrder', body => {
        return _.matches({
          type: 'EXCHANGE LIMIT',
          symbol: 'ETH:USDT',
          amount: '-0.1',
          price: 1000,
          meta: {
            ethAddress: '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404',
            starkKey:
              '77a3b314db07c45076d11f62b6f9e748a39790441823307743cf00d6597ea43'
          }
        })
      })
      .reply(200, apiResponse)

    const response = await dvf.submitOrder(
      'ETH:USDT', // symbol
      '-0.1', // amount
      1000, // price
      '', // gid
      '', // cid
      '0', // signedOrder
      '0', // validFor
      '', // partnerId
      '', // feeRate
      '', // dynamicFeeRate
      starkPrivateKey
    )
    expect(response.id).toEqual(apiResponse.id)

    done()
  })

  it('Gives an error on missing symbol in request', async done => {
    const response = await dvf.submitOrder(
      '', // symbol
      '0.1', // amount
      1000, // price
      '', // gid
      '', // cid
      '0', // signedOrder
      '0', // validFor
      '', // partnerId
      '', // feeRate
      '', // dynamicFeeRate
      ''
    )
    expect(response.error).toEqual('ERR_INVALID_SYMBOL')

    done()
  })

  it('Gives an error on invalid symbol format', async done => {
    const response = await dvf.submitOrder(
      'ETHS', // symbol
      '0.1', // amount
      1000, // price
      '', // gid
      '', // cid
      '0', // signedOrder
      '0', // validFor
      '', // partnerId
      '', // feeRate
      '', // dynamicFeeRate
      ''
    )
    expect(response.error).toEqual('ERR_INVALID_SYMBOL')

    done()
  })

  it('Gives an error on invalid amount', async done => {
    const response = await dvf.submitOrder(
      'ETH:USDT', // symbol
      '0', // amount
      1000, // price
      '', // gid
      '', // cid
      '0', // signedOrder
      '0', // validFor
      '', // partnerId
      '', // feeRate
      '', // dynamicFeeRate
      ''
    )
    expect(response.error).toEqual('ERR_AMOUNT_MISSING')

    done()
  })

  it('Gives an error on missing price', async done => {
    const response = await dvf.submitOrder(
      'ETH:USDT', // symbol
      '10', // amount
      '', // price
      '', // gid
      '', // cid
      '0', // signedOrder
      '0', // validFor
      '', // partnerId
      '', // feeRate
      '', // dynamicFeeRate
      ''
    )
    expect(response.error).toEqual('ERR_PRICE_MISSING')

    done()
  })

  it('Gives an error on missing starkPrivateKey', async done => {
    const response = await dvf.submitOrder(
      'ETH:USDT', // symbol
      '10', // amount
      '100', // price
      '', // gid
      '', // cid
      '0', // signedOrder
      '0', // validFor
      '', // partnerId
      '', // feeRate
      '', // dynamicFeeRate
      ''
    )
    expect(response.error).toEqual('ERR_STARK_PRIVATE_KEY_MISSING')

    done()
  })
})
