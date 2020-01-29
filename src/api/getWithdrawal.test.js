const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('getWithdrawal', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
    await dvf.getUserConfig()
  })

  it('gets a withdrawal from the API using withdrawalId....', async done => {
    const apiResponse = [[1234]]

    nock(dvf.config.api)
      .post('/v1/trading/r/getWithdrawal', body => {
        //console.log('singe withdrawal ', body)
        return (
          _.isMatch(body, {
            withdrawalId: '123'
          }) &&
          body.signature &&
          body.nonce
        )
      })
      .reply(200, apiResponse)

    const withdrawal = await dvf.getWithdrawal('123')
    expect(withdrawal).toEqual(apiResponse)

    done()
  })

  it('checks for withdrawalId....', async done => {
    const withdrawal = await dvf.getWithdrawal(null)
    expect(withdrawal.error).toEqual('ERR_INVALID_WITHDRAWAL_ID')
    done()
  })
})
