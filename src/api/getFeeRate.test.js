const nock = require('nock')
const instance = require('./test/helpers/instance')
const url = require('url')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('getFeeRate', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it(`Query for fee rates`, async () => {
    // TODO: record actual response with current version of the API
    // mock bfx response for currency value using nockBack

    const apiResponse = {
      address: '0x65ceee596b2aba52acc09f7b6c81955c1db86404',
      timestamp: 1588597769117,
      fees: { maker: 15, taker: 20 }
    }

    const queryValidator = jest.fn((uri, body) => {
      const parsed = new url.URL(uri, 'http://example.com')
      expect(typeof parseInt(parsed.searchParams.get('nonce'))).toBe('number')
      expect(parsed.searchParams.get('signature')).toMatch(/[\da-f]/i)
      return [200, apiResponse]
    })

    nock(dvf.config.api)
      .get('/v1/trading/r/feeRate')
      .query(true)
      .reply(queryValidator)

    const response = await dvf.getFeeRate()
    expect(queryValidator).toBeCalled()
    expect(response).toMatchObject(apiResponse)
  })
})
