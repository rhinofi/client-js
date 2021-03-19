const nock = require('nock')
const instance = require('./test/helpers/instance')
const _ = require('lodash')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.getBalance', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it(`Returns the user's token balance`, async () => {
    const apiResponse = { starkBalance: 'success' }

    const nonce = Date.now() / 1000 + ''
    const signature = await dvf.sign(nonce.toString(16))

    nock(dvf.config.api)
      .post('/v1/trading/r/getBalance', body => {
        //console.log('get balance ', body)
        return (
          _.isMatch(body, {
            token: 'ETH'
          }) && body.signature
        )
      })
      .reply(200, apiResponse)

    const balance = await dvf.getBalance({token: 'ETH'}, nonce, signature)
    expect(balance).toEqual(apiResponse)
  })

  // it('GetBalance checks for missing token', async done => {
  //   const balance = await dvf.getBalance(null)
  //   expect(balance.error).toEqual('ERR_TOKEN_MISSING')

  //   done()
  // })

  // it('GetBalance checks for missing token', async done => {
  //   const balance = await dvf.getBalance('ETHUSD')
  //   expect(balance.error).toEqual('ERR_INVALID_TOKEN')

  //   done()
  // })

  it('Posts to get balance API and gets error response', async () => {
    const nonce = Date.now() / 1000 + ''
    const signature = await dvf.sign(nonce.toString(16))

    const apiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message:
        'Please contact support if you believe there should not be an error here',
      details: {
        error: {
          type: 'DVFError',
          message: 'STARK_ORDER_VERIFICATION_ERROR'
        }
      }
    }

    nock(dvf.config.api)
      .post('/v1/trading/r/getBalance')
      .reply(422, apiErrorResponse)

    try {
      await dvf.getBalance({token: 'ETH'}, nonce, signature)
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
    }
  })
})
