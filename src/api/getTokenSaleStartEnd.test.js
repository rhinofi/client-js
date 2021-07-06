const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.getTokenSaleStartEnd', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Returns the token sale start and end times recieved from the API....', async () => {
    const apiResponse = {
      start: 126545121,
      end: 12852221
    }
    const token = 'DVF'

    nock(dvf.config.api)
      .get('/v1/trading/r/getTokenSaleStartEnd')
      .query({ token })
      .reply(200, apiResponse)

    const liquidity = await dvf.getTokenSaleStartEnd(token)
    expect(JSON.parse(liquidity)).toEqual(apiResponse)
  })
})
