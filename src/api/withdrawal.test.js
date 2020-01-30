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
    await dvf.getUserConfig()
  })

  it(`posts user's deposit request`, async done => {
    const token = 'ETH'
    const amount = 1
    const nonce = Date.now() / 1000 + ''
    const signature = await dvf.sign(nonce.toString(16))
    const ethAddress = dvf.get('account')

    const apiResponse = { token, amount, nonce, signature }
    nock(dvf.config.api)
      .post('/v1/trading/w/withdrawal', body => {
        //console.log('get balance ', body)
        return _.isMatch(body, apiResponse)
      })
      .reply(200, apiResponse)

    const result = await dvf.withdrawal(token, amount, nonce, signature)
    expect(result).toEqual(apiResponse)

    done()
  })

  it(`Lets nonce and signature to be optional`, async done => {
    const token = 'ETH'
    const amount = 1
    const ethAddress = dvf.get('account')

    const apiResponse = { token, amount }
    nock(dvf.config.api)
      .post('/v1/trading/w/withdrawal', body => {
        //console.log('get balance ', body)
        return _.isMatch(body, apiResponse)
      })
      .reply(200, apiResponse)

    const result = await dvf.withdrawal(token, amount)
    //console.log(result)
    expect(result).toEqual(apiResponse)

    done()
  })
})
