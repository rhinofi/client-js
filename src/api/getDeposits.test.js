const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('dvf.getDeposits', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
    await dvf.getUserConfig()
  })

  it(`Query for all deposits`, async () => {
    const apiResponse = []
    
    const payloadValidator = jest.fn((body) => {
      expect(typeof body.nonce).toBe('number')
      expect(typeof body.signature).toBe('string')
      expect(typeof body.token).toBe('undefined')

      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/r/getDeposits', payloadValidator)
      .reply(200, apiResponse)

    const result = await dvf.getDeposits()

    expect(payloadValidator).toBeCalled()

    expect(result).toEqual(apiResponse)
  })

  it(`Query for deposits for a given token`, async () => {
    const nonce = Date.now() / 1000 + ''
    const signature = await dvf.sign(nonce.toString(16))
    const token = 'ETH'

    const apiResponse = []

    const payloadValidator = jest.fn((body) => {
      expect(body.nonce).toEqual(nonce)
      expect(body.signature).toEqual(signature)
      expect(body.token).toEqual(token)

      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/r/getDeposits', payloadValidator)
      .reply(200, apiResponse)

    const result = await dvf.getDeposits(token, nonce, signature)

    expect(payloadValidator).toBeCalled()

    expect(result).toEqual(apiResponse)
  })

  it(`Lets nonce and signature to be optional`, async () => {
    const token = 'ZRX'

    const apiResponse = []

    const payloadValidator = jest.fn((body) => {
      expect(typeof body.nonce).toBe('number')
      expect(typeof body.signature).toBe('string')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/r/getDeposits', payloadValidator)
      .reply(200, apiResponse)

    const result = await dvf.getDeposits(token)

    expect(payloadValidator).toBeCalled()

    expect(result).toEqual(apiResponse)
  })


})
