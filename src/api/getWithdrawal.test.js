const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.getWithdrawal', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Query for specific withdrawalId', async () => {
    const apiResponse = [[1234]]

    const payloadValidator = jest.fn(body => {
      expect(body.withdrawalId).toBe('123')
      expect(typeof body.nonce).toBe('string')
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
    } catch (error) {
      expect(error.message).toEqual('ERR_INVALID_WITHDRAWAL_ID')
    }
  })

  it('Posts to get withdrawal config API and gets error response', async () => {
    const apiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message:
        'Please contact support if you believe there should not be an error here',
      details: {
        error: {
          type: 'DVFError',
          message: 'WITHDRAWAL_NOT_FOUND'
        }
      }
    }

    const payloadValidator = jest.fn(() => true)

    nock(dvf.config.api)
      .post('/v1/trading/r/getWithdrawal', payloadValidator)
      .reply(422, apiErrorResponse)

    try {
      await dvf.getWithdrawal('123')
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
