const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')
const makeQueryValidator = require('./test/helpers/makeQueryValidator')

let dvf

describe('getBalanceUsd', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Queries for user USD balance', async () => {
    // TODO: record actual response with current version of the API
    // mock bfx response for currency value using nockBack

    const apiResponse = {
      ethAddress: '0x14d06788090769f669427b6aea1c0240d2321f34',
      balanceUsd: '2'
    }

    const queryValidator = makeQueryValidator(apiResponse)

    nock(dvf.config.api)
      .get('/v1/trading/r/getBalanceUsd')
      .query(true)
      .reply(queryValidator)

    const response = await dvf.getBalanceUsd()
    expect(queryValidator).toBeCalled()
    expect(response).toMatchObject(apiResponse)
  })
})
