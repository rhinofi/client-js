const nock = require('nock')

const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')
const makeQueryValidator = require('./test/helpers/makeQueryValidator')

let dvf

describe('getFeeRate', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it(`Query for user's 30 days trading  volume`, async () => {
    // TODO: record actual response with current version of the API
    // mock bfx response for currency value using nockBack

    const apiResponse = {
      totalUSDVolume: 199.7428219247271,
      tokens: {
        ETH: { tokenAmount: 0.51, USDVolume: 82.0539 },
        ZRX: { tokenAmount: 178.53426171, USDVolume: 117.6889219247271 }
      },
      startDate: '2020-04-04T16:54:25.886Z'
    }

    const queryValidator = makeQueryValidator(apiResponse)

    nock(dvf.config.api)
      .get('/v1/trading/r/30DaysVolume')
      .query(true)
      .reply(queryValidator)

    const response = await dvf.get30DaysVolume()
    expect(queryValidator).toBeCalled()
    expect(response).toMatchObject(apiResponse)
  })
})
