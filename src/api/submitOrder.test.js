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

  it('Submits buy order and receives response', async () => {
    mockGetConf()
    const symbol = 'ETH:USDT'
    const amount = 0.137
    const price = 250
    validFor = '0'
    feeRate = '0'

    const expectedBody = {
      cid: '1',
      gid: '1',
      type: 'EXCHANGE LIMIT',
      symbol,
      amount,
      price,
      meta: {
        starkPublicKey: {
          x: '6d840e6d0ecfcbcfa83c0f704439e16c69383d93f51427feb9a4f2d21fbe075',
          y: '58f7ce5eb6eb5bd24f70394622b1f4d2c54ebca317a3e61bf9f349dccf166cf'
        }
      },
      protocol: 'stark',
      partnerId: 'P1',
      feeRate: '0',
      dynamicFeeRate: '0'
    }
    const starkPrivateKey = process.env.PRIVATE_STARK_KEY

    const payloadValidator = jest.fn(body => {
      console.log('posted body ->', body)
      expect(body).toMatchObject(expectedBody)
      expect(body.meta.ethAddress).toMatch(/[\da-f]/i)
      expect(body.meta.starkMessage).toMatch(/[\da-f]/i)
      expect(body.meta.starkSignature.r).toMatch(/[\da-f]/i)
      expect(body.meta.starkSignature.s).toMatch(/[\da-f]/i)
      expect(body.meta.starkSignature.recoveryParam).toBeLessThan(5)
      expect(typeof body.meta.starkOrder.expirationTimestamp).toBe('number')
      expect(typeof body.meta.starkOrder.nonce).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/submitOrder', payloadValidator)
      .reply(200)

    const orderMetaData = await dvf.stark.createOrderMetaData(
      symbol,
      amount,
      price,
      validFor,
      feeRate,
      starkPrivateKey
    )

    const response = await dvf.submitOrder(
      '1', // gid
      '1', // cid
      'P1', // partnerId
      '0', // feeRate
      '0', // dynamicFeeRate
      orderMetaData
    )
  })

  it('Submits sell order and receives response', async () => {
    mockGetConf()
    const apiResponse = { id: '408231' }

    // User Specific Parameters
    const starkPrivateKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'

    nock(dvf.config.api)
      .post('/v1/trading/w/submitOrder', body => {
        return _.matches({
          type: 'EXCHANGE LIMIT',
          symbol: 'ZRX:ETH',
          amount: '-41',
          price: 0.079091,
          meta: {
            ethAddress: '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404',
            starkKey:
              '77a3b314db07c45076d11f62b6f9e748a39790441823307743cf00d6597ea43'
          }
        })
      })
      .reply(200, apiResponse)

    const orderMetaData = await dvf.stark.createOrderMetaData(
      'ZRX:ETH', // symbol
      '-55', // amount
      100, // price
      '0', // validFor
      '', // feeRate
      starkPrivateKey
    )

    const response = await dvf.submitOrder(
      '', // gid
      '', // cid
      '0', // signedOrder
      '', // partnerId
      '', // dynamicFeeRate
      orderMetaData
    )

    console.log({ response })
    expect(response.id).toEqual(apiResponse.id)
  })

  it('Gives an error on missing symbol in request', async () => {
    try {
      await dvf.stark.createOrderMetaData(
        '', // symbol
        '5', // amount
        219, // price
        '0', // validFor
        '', // feeRate
        '12345'
      )

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_INVALID_SYMBOL')
    }
  })

  it('Gives an error on invalid symbol format', async () => {
    try {
      await dvf.stark.createOrderMetaData(
        'ETHZRX', // symbol
        '5', // amount
        219, // price
        '0', // validFor
        '', // feeRate
        '12345'
      )

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_INVALID_SYMBOL')
    }
  })

  it('Gives an error on invalid amount', async () => {
    try {
      await dvf.stark.createOrderMetaData(
        'ETH:USDT', // symbol
        '0', // amount
        219, // price
        '0', // validFor
        '', // feeRate
        '12345'
      )

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_AMOUNT_MISSING')
    }
  })

  it('Gives an error on missing price', async () => {
    try {
      await dvf.stark.createOrderMetaData(
        'ETH:USDT', // symbol
        '-1.2', // amount
        '', // price
        '0', // validFor
        '', // feeRate
        '12345'
      )

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_PRICE_MISSING')
    }
  })

  it('Gives an error on missing starkPrivateKey', async () => {
    try {
      await dvf.stark.createOrderMetaData(
        'ETH:USDT', // symbol
        '10', // amount
        219, // price
        '0', // validFor
        '', // feeRate
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
          message: 'MUST_REGISTER'
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
