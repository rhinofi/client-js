const nock = require('nock')
const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')

describe('dvf.claimAirdrop', () => {
  let dvf
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  const mockApi = (apiResponse, payloadValidator, status = 200) =>
    nock(dvf.config.api)
      .post('/v1/trading/w/claimAirdrop', payloadValidator)
      .reply(status, apiResponse)

  it('Posts to cancel order API and gets response', async () => {
    const apiResponse = true

    const payloadValidator = jest.fn(payload => {
      expect(typeof payload.ethAddress).toBe('string')
      expect(typeof payload.token).toBe('string')
      return true
    })

    mockApi(apiResponse, payloadValidator)
    const payload = {
      ethAddress: '0x08152c1265dbc218ccc8ab5c574e6bd52279b3b7',
      token: 'DVF'
    }
    const response = await dvf.claimAirdrop(payload)

    expect(payloadValidator).toBeCalled()
    expect(response).toEqual(apiResponse)
  })
})
