const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('getFeeRate', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it(`Query for fee rates`, async () => {
    // TODO: record actual response with current version of the API
    // mock bfx response for currency value using nockBack
    const apiResponse = { 
      address: '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404',
      timestamp: 1568959208939,
      fees: { 
        small: { threshold: 0, feeBps: 25 },
        medium: { threshold: 500, feeBps: 21 },
        large: { threshold: 2000, feeBps: 20 } 
      },
      signature: '0x52f18b47494e465aa4ed0f0f123fae4d40d3ac0862b61862e6cc8e5a119dbfe1061a4ee381092a10350185071f4829dbfd6c5f2e26df76dee0593cbe3cbd87321b' 
    }
  
    const payloadValidator = jest.fn(body => {
      expect(typeof body.nonce).toBe('number')
      expect(typeof body.signature).toBe('string')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/r/getFeeRates', payloadValidator)
      .reply(200, apiResponse)

    const symbol = 'ETH:USD'
    const amount = -0.1
    const price = 1000
  
    const response = await dvf.getFeeRates(symbol, amount, price)

    expect(payloadValidator).toBeCalled()

    expect(response.feeRate.threshold).toEqual(0)
    expect(response.feeRate.feeBps).toEqual(25)
    expect(response.feeRates).toMatchObject(apiResponse)
  })
})