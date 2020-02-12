const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

const sw = require('starkware_crypto')
const _ = require('lodash')

let dvf

describe('dvf.submitOrder', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it.only('Submits buy order and receives response', async () => {
    const apiResponse = { id: '408231' }
    const starkPrivateKey = process.env.PRIVATE_STARK_KEY

    const payloadValidator = jest.fn((body) => {
      // console.log("posted body ->", body)

      // TODO: validate payload properly
      //     type: 'EXCHANGE LIMIT',
      //     symbol: 'ZRX:ETH',
      //     amount: '10',
      //     price: 1,
      //     meta: {
      //       ethAddress: '0x341e46a49f15785373ede443df0220dea6a41bbc',
      //       starkKey:
      //         '6d840e6d0ecfcbcfa83c0f704439e16c69383d93f51427feb9a4f2d21fbe075'
      //     }
      //   })
      expect(body.type).toEqual('EXCHANGE LIMIT')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/submitOrder', payloadValidator)
      .reply(200, apiResponse)

    const response = await dvf.submitOrder(
      'ZRX:ETH', // symbol
      10, // amount
      1, // price
      '', // gid
      '', // cid
      '0', // signedOrder
      '0', // validFor
      'P1', // partnerId
      '', // feeRate
      '', // dynamicFeeRate
      starkPrivateKey
    )

    return
    
    expect(response.id).toEqual(apiResponse.id)
  })

  it.only('Submits sell order and receives response', async () => {
    const apiResponse = { id: '408231' }

    // User Specific Parameters
    const starkPrivateKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'

    nock(dvf.config.api)
      .post('/v1/trading/w/submitOrder', body => {
        return _.matches({
          type: 'EXCHANGE LIMIT',
          symbol: 'ZRX:ETH',
          amount: '-15',
          price: 100,
          meta: {
            ethAddress: '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404',
            starkKey:
              '77a3b314db07c45076d11f62b6f9e748a39790441823307743cf00d6597ea43'
          }
        })
      })
      .reply(200, apiResponse)

    const response = await dvf.submitOrder(
      'ZRX:ETH', // symbol
      '-55', // amount
      100, // price
      '', // gid
      '', // cid
      '0', // signedOrder
      '0', // validFor
      '', // partnerId
      '', // feeRate
      '', // dynamicFeeRate
      starkPrivateKey
    )
    console.log({ response })
    expect(response.id).toEqual(apiResponse.id)
  })

  it('Gives an error on missing symbol in request', async () => {
    try {
      await dvf.submitOrder(
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

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_INVALID_SYMBOL')
    }
  })

  it('Gives an error on invalid symbol format', async () => {
    try {
      await dvf.submitOrder(
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

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_INVALID_SYMBOL')
    }
  })

  it('Gives an error on invalid amount', async () => {
    try {
      await dvf.submitOrder(
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

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_AMOUNT_MISSING')
    }
  })

  it('Gives an error on missing price', async () => {
    try {
      await dvf.submitOrder(
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

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_PRICE_MISSING')
    }
  })

  it('Gives an error on missing starkPrivateKey', async () => {
    try {
      await dvf.submitOrder(
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

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_STARK_PRIVATE_KEY_MISSING')
    }
  })


  it('Posts to submit order config API and gets error response', async () => {

    const apiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message:
        'Please contact support if you believe there should not be an error here',
      details: {
        error: {
          type: 'DVFError',
          message: 'MUST_REGISTER_PRE_DEPOSIT'
        }
      }
    }

    const payloadValidator = jest.fn(() => true)

    nock(dvf.config.api)
      .post('/v1/trading/w/submitOrder', payloadValidator)
      .reply(422, apiErrorResponse)

    try {
      await dvf.submitOrder(
        'ETH:ZRX', // symbol
        1, // amount
        1, // price
        '', // gid
        '', // cid
        '0', // signedOrder
        '0', // validFor
        'P1', // partnerId
        '', // feeRate
        '', // dynamicFeeRate
        '100'
      )
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
