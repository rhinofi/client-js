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
      address: '0x65ceee596b2aba52acc09f7b6c81955c1db86404',
      timestamp: 1588597769117,
      fees: { maker: 15, taker: 20 }
    }

    const payloadValidator = jest.fn((body) => {
      expect(typeof body.nonce).toBe('number')
      expect(typeof body.signature).toBe('string')
      return true
    })

    nock(dvf.config.api)
      .get('/v1/trading/r/feeRate')
      .query(true)
      .reply(200, apiResponse)

    const response = await dvf.getFeeRate()

    expect(response).toMatchObject(apiResponse)
  })
})
