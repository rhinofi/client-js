const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('getBalance', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
  })

  it('Returns the config recieved from the API', async done => {
    const apiResponse = { starkBalance: 'success' }

    nock('https://app.stg.deversifi.com/')
      .post('/v1/trading/r/getBalance', body => {
        return (
          _.isMatch(body, {
            token: 'ETH'
          }) && body.signature
        )
      })
      .reply(200, apiResponse)

    const balance = await dvf.getBalance('ETH')
    expect(balance).toEqual(apiResponse)

    done()
  })

  it('GetBalance checks for missing token', async done => {
    const balance = await dvf.getBalance(null)
    expect(balance.error).toEqual('ERR_TOKEN_MISSING')

    done()
  })

  it('GetBalance checks for missing token', async done => {
    const balance = await dvf.getBalance('ETHUSD')
    expect(balance.error).toEqual('ERR_INVALID_TOKEN')

    done()
  })
})
