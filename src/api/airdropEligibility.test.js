const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.airdropEligibility', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Returns the DVF airdrop amount eligible for this address recieved from the API....', async () => {
    const apiResponse = '15.53'
    const ethAddress = '0x1234'

    nock(dvf.config.api)
      .get('/v1/trading/r/airdropEligibility')
      .query({ ethAddress })
      .reply(200, apiResponse)

    const amount = await dvf.airdropEligibility(ethAddress)
    expect(amount).toEqual(apiResponse)
  })
})
