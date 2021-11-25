const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.estimatedNextBatchTime', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it('Returns the config received from the API', async () => {
    const apiResponse = {
      estimatedTime: 10000
    }

    nock(dvf.config.api)
      .get('/v1/trading/r/estimatedNextBatchTime')
      .query(true)
      .reply(200, apiResponse)

    const response = await dvf.estimatedNextBatchTime()
    expect(response).toEqual(apiResponse)
  })

  it('Posts to config API and gets error response', async () => {
    const apiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message:
        'Please contact support if you believe there should not be an error here',
      details: {
        name: 'RequestError',
        message: 'Error: connect ECONNREFUSED 127.0.0.1:2222'
      }
    }

    nock(dvf.config.api)
      .get('/v1/trading/r/estimatedNextBatchTime')
      .query(true)
      .reply(422, apiErrorResponse)

    try {
      await dvf.estimatedNextBatchTime()
    } catch (e) {
      expect(JSON.parse(e.error)).toEqual(apiErrorResponse)
    }
  })
})
