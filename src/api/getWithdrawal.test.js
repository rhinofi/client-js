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

  it('Query for specific withdrawalId', async done => {
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

    done()
  })

  it('validate withdrawalId....', async done => {
    const withdrawal = await dvf.getWithdrawal(null)

    expect(withdrawal.error).toEqual('ERR_INVALID_WITHDRAWAL_ID')
    done()
  })
})
