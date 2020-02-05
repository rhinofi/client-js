const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('dvf.getWithdrawal', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
    await dvf.getUserConfig()
  })

  it('Query for specific withdrawalId', async () => {
    const apiResponse = [[1234]]

    const payloadValidator = jest.fn((body) => {
      expect(body.withdrawalId).toBe('123')

      expect(typeof body.nonce).toBe('number')
      expect(typeof body.signature).toBe('string')

      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/r/getWithdrawal', payloadValidator)
      .reply(200, apiResponse)

    const withdrawal = await dvf.getWithdrawal('123')

    expect(payloadValidator).toBeCalled()

    expect(withdrawal).toEqual(apiResponse)
  })

  it('validate withdrawalId....', async () => {
    try {
      await dvf.getWithdrawal(null)

      throw new Error('function should throw')
    } catch(error) {
      expect(error.message).toEqual('ERR_INVALID_WITHDRAWAL_ID')
    }
  })
})
