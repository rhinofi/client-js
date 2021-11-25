const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.cancelWithdrawal', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it('Posts to cancel withdrawal API and gets response', async () => {
    const id = '1'
    const apiResponse = { cancelWithdrawal: 'success' }

    const payloadValidator = jest.fn(body => {
      expect(body.id).toEqual(id)
      expect(typeof body.id).toBe('string')
      expect(typeof body.nonce).toBe('string')
      expect(typeof body.signature).toBe('string')

      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/cancelWithdrawal', payloadValidator)
      .reply(200, apiResponse)

    const response = await dvf.cancelWithdrawal(id)

    expect(payloadValidator).toBeCalled()

    expect(response).toEqual(apiResponse)
  })

  it('Posts to cancel withdrawal API and gets error response', async () => {
    const id = '1'
    const apiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message:
        'Please contact support if you believe there should not be an error here',
      details: {
        error: {
          type: 'DVFError',
          message: 'STARK_SIGNATURE_VERIFICATION_ERROR'
        }
      }
    }
    const payloadValidator = jest.fn(() => true)

    nock(dvf.config.api)
      .post('/v1/trading/w/cancelWithdrawal', payloadValidator)
      .reply(422, apiErrorResponse)

    try {
      await dvf.cancelWithdrawal(id)
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
