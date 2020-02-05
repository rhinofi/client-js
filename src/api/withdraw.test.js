const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('dvf.withdraw', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
    await dvf.getUserConfig()
  })

  it(`posts user's withdrawal request`, async () => {
    const token = 'ETH'
    const amount = 1

    const apiResponse = { ok: true }

    const payloadValidator = jest.fn((body) => {
      expect(body.token).toEqual(token)
      expect(body.amount).toEqual(amount)

      expect(typeof body.nonce).toBe('number')
      expect(typeof body.signature).toBe('string')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/withdraw', payloadValidator)
      .reply(200, apiResponse)

    const result = await dvf.withdraw(token, amount)

    expect(payloadValidator).toBeCalled()
    expect(result).toEqual(apiResponse)
  })

})
