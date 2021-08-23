const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.getTokenHolders', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Returns the token holders count recieved from the API....', async () => {
    const apiResponse = '15'
    const token = 'DVF'

    nock(dvf.config.api)
      .get('/v1/trading/r/getTokenHolders')
      .query({ token })
      .reply(200, apiResponse)

    const tokenHolders = await dvf.getTokenHolders(token)
    expect(tokenHolders).toEqual(apiResponse)
  })
})
