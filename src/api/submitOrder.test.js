const nock = require('nock')
const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')

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

    await dvf.submitOrder({
      symbol,
      amount,
      price,
      validFor,
      feeRate,
      starkPrivateKey,
      gid: '1', // gid
      cid: '1', // cid
      partnerId: 'P1', // partnerId
      dynamicFeeRate: '0'
    })

    expect(payloadValidator).toBeCalled()
  })

  it('Submits sell order and receives response', async () => {
    mockGetConf()
    const symbol = 'ZRX:ETH'
    const amount = -55
    const price = 100
    validFor = '0'
    feeRate = ''

    const starkPrivateKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'

    const expectedBody = {
      cid: '',
      gid: '',
      type: 'EXCHANGE LIMIT',
      symbol,
      amount,
      price,
      feeRate,
      meta: {
        starkPublicKey: {
          x: '77a3b314db07c45076d11f62b6f9e748a39790441823307743cf00d6597ea43',
          y: '54d7beec5ec728223671c627557efc5c9a6508425dc6c900b7741bf60afec06'
        }
      },
      protocol: 'stark',
      partnerId: '',
      dynamicFeeRate: ''
    }

    const payloadValidator = jest.fn(body => {
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

    await dvf.submitOrder({
      symbol,
      amount,
      price,
      validFor,
      feeRate,
      starkPrivateKey,
      gid: '', // gid
      cid: '', // cid
      partnerId: '', // partnerId
      dynamicFeeRate: ''
      // ledgerPath: `21323'/0`
    })
    expect(payloadValidator).toBeCalled()
  })

  it('Gives an error on missing symbol in request', async () => {
    try {
      await dvf.submitOrder({
        symbol: '',
        amount: 100,
        price: 125,
        validFor: 0,
        feeRate: 0,
        starkPrivateKey: '0x12345',
        gid: '', // gid
        cid: '', // cid
        partnerId: '', // partnerId
        dynamicFeeRate: ''
        // ledgerPath: `21323'/0`
      })

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_INVALID_SYMBOL')
    }
  })

  it('Gives an error on invalid symbol format', async () => {
    try {
      await dvf.submitOrder({
        symbol: 'ETHUSDT',
        amount: 100,
        price: 125,
        validFor: 0,
        feeRate: 0,
        starkPrivateKey: '0x12345',
        gid: '', // gid
        cid: '', // cid
        partnerId: '', // partnerId
        dynamicFeeRate: ''
        // ledgerPath: `21323'/0`
      })

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_INVALID_SYMBOL')
    }
  })

  it('Gives an error on invalid amount', async () => {
    try {
      await dvf.submitOrder({
        symbol: 'ETH_USDT',
        amount: 0,
        price: 125,
        validFor: 0,
        feeRate: 0,
        starkPrivateKey: '0x12345',
        gid: '', // gid
        cid: '', // cid
        partnerId: '', // partnerId
        dynamicFeeRate: ''
        // ledgerPath: `21323'/0`
      })

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_AMOUNT_MISSING')
    }
  })

  it('Gives an error on missing price', async () => {
    try {
      await dvf.submitOrder({
        symbol: 'ZRX:ETH',
        amount: 100,
        price: '',
        validFor: 0,
        feeRate: 0,
        starkPrivateKey: '0x12345',
        gid: '', // gid
        cid: '', // cid
        partnerId: '', // partnerId
        dynamicFeeRate: ''
        // ledgerPath: `21323'/0`
      })

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_PRICE_MISSING')
    }
  })

  it('Gives an error on missing starkPrivateKey', async () => {
    try {
      await dvf.submitOrder({
        symbol: 'ETH:USDT',
        amount: 100,
        price: 125,
        validFor: 0,
        feeRate: 0,
        gid: '', // gid
        cid: '', // cid
        partnerId: '', // partnerId
        dynamicFeeRate: ''
        // ledgerPath: `21323'/0`
      })

      throw new Error('function should throw')
    } catch (error) {
      expect(error.message).toEqual('ERR_STARK_PRIVATE_KEY_MISSING')
    }
  })

  it('Posts to submit order gets error response', async () => {
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
      await dvf.submitOrder({
        symbol: 'ETH:ZRX',
        amount: 1,
        price: 1,
        validFor: '0',
        feeRate: '',
        gid: '', // gid
        cid: '', // cid
        partnerId: 'P1', // partnerId
        dynamicFeeRate: '',
        starkPrivateKey: '100'
        // ledgerPath: `21323'/0`
      })
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
