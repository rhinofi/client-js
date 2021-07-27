const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.addAirdrops', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it('Posts to add airdrops', async () => {
    const airdrops = [{ user: '1', token: 'ETH', amount: '100' }]

    const payloadValidator = jest.fn(body => {
      expect(body.airdrops).toMatchObject(airdrops)
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/r/addAirdrops', payloadValidator)
      .reply(200, airdrops)

    const response = await dvf.addAirdrops(airdrops)

    expect(payloadValidator).toBeCalled()

    expect(response).toEqual(airdrops)
  })
})
