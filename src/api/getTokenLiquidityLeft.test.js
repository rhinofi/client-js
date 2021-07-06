const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.getTokenLiquidityLeft', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Returns the token liquidity left recieved from the API....', async () => {
    const apiResponse = '0.3245'
    const token = 'DVF'

    nock(dvf.config.api)
      .get('/v1/trading/r/getTokenLiquidityLeft')
      .query({ token })
      .reply(200, apiResponse)

    const liquidity = await dvf.getTokenLiquidityLeft(token)
    expect(liquidity).toEqual(apiResponse)
  })
})
