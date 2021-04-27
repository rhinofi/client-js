const nock = require('nock')
const instance = require('../test/helpers/instance')

const mockGetConf = require('../test/fixtures/getConf')

let dvf

describe('dvf.account.permissions', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  const apiResponse = { balances: true, tradingHistory: false }

  it('Posts getPublicUserPermissions to get current api permissions', async () => {
    nock(dvf.config.api)
      .post('/v1/trading/r/getPublicUserPermissions')
      .reply(200, apiResponse)

    const response = await dvf.account.getPermissions()

    expect(response).toEqual(apiResponse)
  })

  it('Posts setPublicUserPermissions to get current api permissions', async () => {
    nock(dvf.config.api)
      .post('/v1/trading/r/setPublicUserPermissions')
      .reply(200, apiResponse)

    const response = await dvf.account.setPermissions({ key: 'balances', value: true })

    expect(response).toEqual(apiResponse)
  })
})
