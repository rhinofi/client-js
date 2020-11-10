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
    const validFor = '0'
    const feeRate = '0'

    const expectedBody = {
      cid: '1',
      gid: '1',
      type: 'EXCHANGE LIMIT',
      symbol,
      amount: '0.137',
      price: '250',
      meta: {
        starkPublicKey: {
          x: '07a83d131fe965ad7e70f259e3cf1e785dcfacf319a64115faeabb64a2fd8af0',
          y: '4de195d61296b6ac602ab5db8d190b90cd1e767fe9d47d4c9d96ab62cf7ad41'
        }
      },
      protocol: 'stark',
      partnerId: 'P1',
      feeRate: 0.0025
    }
    const starkPrivateKey = process.env.PRIVATE_STARK_KEY

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(expectedBody)
      expect(body.meta.ethAddress).toMatch(/[\da-f]/i)
      expect(body.meta.starkMessage).toMatch(/[\da-f]/i)
      expect(body.meta.starkSignature.r).toMatch(/[\da-f]/i)
      expect(body.meta.starkSignature.s).toMatch(/[\da-f]/i)
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
      feeRate: 0.0025,
      starkPrivateKey,
      gid: '1', // gid
      cid: '1', // cid
      partnerId: 'P1' // partnerId
    })

    expect(payloadValidator).toBeCalled()
  })

  it('Submits sell order and receives response', async () => {
    mockGetConf()
    const symbol = 'ZRX:ETH'
    const amount = -55
    const price = 100
    const validFor = '0'

    const starkPrivateKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'

    const expectedBody = {
      cid: '',
      gid: '',
      type: 'EXCHANGE LIMIT',
      symbol,
      amount: '-55',
      price: '100',
      feeRate: 0.0025,
      protocol: 'stark',
      partnerId: ''
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(expectedBody)
      expect(body.meta.ethAddress).toMatch(/[\da-f]/i)
      expect(body.meta.starkMessage).toMatch(/[\da-f]/i)
      expect(body.meta.starkPublicKey.x).toMatch(/[\da-f]/i)
      expect(body.meta.starkPublicKey.y).toMatch(/[\da-f]/i)
      expect(body.meta.starkSignature.r).toMatch(/[\da-f]/i)
      expect(body.meta.starkSignature.s).toMatch(/[\da-f]/i)
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
      feeRate: 0.0025,
      starkPrivateKey,
      gid: '', // gid
      cid: '', // cid
      partnerId: '' // partnerId
      // ledgerPath: `44'/60'/0'/0'/0`
    })
    expect(payloadValidator).toBeCalled()
  })

  it('Forces 5 significant digits on price and 8 decimal places on amount', async () => {
    mockGetConf()
    const symbol = 'ZRX:ETH'
    const amount = -55.000000001
    const price = 12.3456
    const validFor = '0'

    const starkPrivateKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'

    const expectedBody = {
      cid: '',
      gid: '',
      type: 'EXCHANGE LIMIT',
      symbol,
      amount: '-55.00000001',
      price: '12.346',
      feeRate: 0.0025,
      protocol: 'stark',
      partnerId: ''
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(expectedBody)
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
      feeRate: 0.0025,
      starkPrivateKey,
      gid: '', // gid
      cid: '', // cid
      partnerId: '' // partnerId
      // ledgerPath: `44'/60'/0'/0'/0`
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
        partnerId: ''
        // ledgerPath: `44'/60'/0'/0'/0`
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
        partnerId: ''
        // ledgerPath: `44'/60'/0'/0'/0`
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
        partnerId: ''
        // ledgerPath: `44'/60'/0'/0'/0`
      })

      throw new Error('function should throw')
    } catch (error) {
      // TODO: shouldn't this be ERR_INVALID_AMOUNT?? since it's not missing
      //   but set to 0
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
        partnerId: '' // partnerId
        // ledgerPath: `44'/60'/0'/0'/0`
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
        partnerId: '' // partnerId
        // ledgerPath: `44'/60'/0'/0'/0`
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
        starkPrivateKey: '100'
        // ledgerPath: `44'/60'/0'/0'/0`
      })
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })

  it.skip('Submits buy order and receives response', async () => {
    mockGetConf()
    const symbol = 'ETH:USDT'
    const amount = 0.137
    const price = 250
    const validFor = '0'

    const expectedBody = {
      cid: '1',
      gid: '1',
      type: 'EXCHANGE LIMIT',
      symbol,
      amount,
      price,
      meta: {
        starkPublicKey: {
          x: '67ab7280c36ba5c977a574c7c03525614ed7be5445ef261bd7b10e506c57119',
          y: '00c3b334e8b109e0427fc88070154458f966ae9ff5a91a058d574a96c24adc23'
        }
      },
      protocol: 'stark',
      partnerId: 'P1',
      feeRate: 0.0025
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(expectedBody)
      expect(body.meta.ethAddress).toMatch(/[\da-f]/i)
      expect(body.meta.starkMessage).toMatch(/[\da-f]/i)
      expect(body.meta.starkSignature.r).toMatch(/[\da-f]/i)
      expect(body.meta.starkSignature.s).toMatch(/[\da-f]/i)
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
      feeRate: 0.0025,
      ledgerPath: '44\'/60\'/0\'/0\'/0',
      gid: '1', // gid
      cid: '1', // cid
      partnerId: 'P1' // partnerId
    })

    expect(payloadValidator).toBeCalled()
  })
})
