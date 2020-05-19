const nock = require('nock')
const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.submitMarketOrder', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Submits market buy order and receives valid payload', async () => {
    mockGetConf()

    const symbol = 'ETH:USDT'
    const amountToSell = 100
    const tokenToSell = 'USDT'
    const worstCasePrice = 250

    const worstCaseAmountToRecieve = +parseFloat(amountToSell / worstCasePrice).toFixed(5)

    const expectedBody = {
      type: 'EXCHANGE MARKET',
      symbol,
      amount: worstCaseAmountToRecieve,
      price: worstCasePrice,
      meta: {
        starkPublicKey: {
          x: '07a83d131fe965ad7e70f259e3cf1e785dcfacf319a64115faeabb64a2fd8af0',
          y: '4de195d61296b6ac602ab5db8d190b90cd1e767fe9d47d4c9d96ab62cf7ad41'
        }
      },
      protocol: 'stark',
      feeRate: 0.002
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

    await dvf.submitMarketOrder({
      symbol,
      amountToSell,
      tokenToSell,
      worstCasePrice,
      feeRate: 0.002,
      starkPrivateKey
    })
    expect(payloadValidator).toBeCalled()
  })

  it('Submits market sell order and receives valid payload', async () => {
    mockGetConf()

    const symbol = 'ETH:USDT'
    const amountToSell = 2
    const tokenToSell = 'ETH'
    const worstCasePrice = 125

    const expectedBody = {
      type: 'EXCHANGE MARKET',
      symbol,
      amount: -amountToSell,
      price: worstCasePrice,
      meta: {
        starkPublicKey: {
          x: '07a83d131fe965ad7e70f259e3cf1e785dcfacf319a64115faeabb64a2fd8af0',
          y: '4de195d61296b6ac602ab5db8d190b90cd1e767fe9d47d4c9d96ab62cf7ad41'
        }
      },
      protocol: 'stark',
      feeRate: 0.002
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

    await dvf.submitMarketOrder({
      symbol,
      amountToSell,
      tokenToSell,
      worstCasePrice,
      feeRate: 0.002,
      starkPrivateKey
    })
    expect(payloadValidator).toBeCalled()
  })
})
