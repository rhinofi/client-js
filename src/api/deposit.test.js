const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

const sw = require('starkware_crypto')
const _ = require('lodash')

let dvf

describe('deposits', () => {

  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
  })

  it('Deposits token to users vault', async done => {

    const apiResponse = { deposit: 'success' }

    const pvtKey = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(starkKeyPair.getPublic(true, 'hex'), 'hex')
    const starkPublicKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }

    const amount = 100
    const token = 'ZRX'

    nock('https://app.stg.deversifi.com/')
      .post('/v1/trading/w/deposit',
        body => {
          body.expireTime &&
          body.starkSignature &&
          body.amount == amount &&
          body.token == token &&
          body.starkPublicKey == starkPublicKey &&
          body.recoveryParam
        })
      .reply(200, apiResponse)

    const result = await dvf.deposit(token, amount, starkKeyPair)
    expect(result).toEqual(apiResponse)

    done()
  })

})
/*
describe('/deposit', () => {


  // 2nd test_case checks for 0, negative or empty amount
  it('Deposit token checks for invalid amount', async () => {
    const pvtKey = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const amount = 0
    const token = 'ZRX'

    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/w/deposit', async body => {
        assert.equal(body.error, 'INVALID_AMOUNT')
        return true
      })
      .reply(200)

    const result = await efx.deposit(token, amount, starkKeyPair)
    console.log('new res ', result)
  })

  // 3rd test_case
  it('Deposit token checks for missing token', async () => {
    const pvtKey = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const amount = 57
    const token = ''

    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/w/deposit', async body => {
        assert.equal(body.error, 'MISSING_TOKEN')
        return true
      })
      .reply(200)

    const result = await efx.deposit(token, amount, starkKeyPair)
    console.log('new res ', result)
  })

  // 4th test_case
  it('Deposit token checks for invalid token', async () => {
    const pvtKey = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const amount = 57
    const token = 'XYZ'

    nock('https://staging-api.deversifi.com/')
      .post('/v1/trading/w/deposit', async body => {
        assert.equal(body.error, 'INVALID_TOKEN')
        return true
      })
      .reply(200)

    const result = await efx.deposit(token, amount, starkKeyPair)
    console.log('new res ', result)
  })
})
*/
