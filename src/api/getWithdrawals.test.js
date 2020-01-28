const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('getWithdrawals', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
    await dvf.getUserConfig()
  })

  it(`Returns the user's withdrawals for token`, async done => {
    const nonce = Date.now() / 1000 + ''
    const signature = await dvf.sign(nonce.toString(16))
    const token = 'ZRX'
    const apiResponse = { nonce, signature, token }
    nock(dvf.config.api)
      .post('/v1/trading/r/getWithdrawals', body => {
        //console.log('get withdrawals ', body)
        return _.isMatch(body, apiResponse)
      })
      .reply(200, apiResponse)

    const result = await dvf.getWithdrawals(nonce, signature, token)
    expect(result).toEqual(apiResponse)

    done()
  })

  it(`Lets nonce and signature to be optional`, async done => {
    const nonce = ''
    const signature = 'null'
    const token = 'ZRX'
    const apiResponse = { token }
    nock(dvf.config.api)
      .post('/v1/trading/r/getWithdrawals', body => {
        return _.isMatch(body, apiResponse) && body.signature && body.nonce
      })
      .reply(200, apiResponse)

    const result = await dvf.getWithdrawals(nonce, signature, token)
    expect(result).toEqual(apiResponse)

    done()
  })

  it(`Lets token be optional`, async done => {
    const nonce = Date.now() / 1000 + ''
    const signature = await dvf.sign(nonce.toString(16))
    const apiResponse = { nonce, signature }
    nock(dvf.config.api)
      .post('/v1/trading/r/getWithdrawals', body => {
        //console.log('get balance ', body)
        return _.isMatch(body, apiResponse)
      })
      .reply(200, apiResponse)

    const result = await dvf.getWithdrawals(nonce, signature)
    expect(result).toEqual(apiResponse)

    done()
  })
})
