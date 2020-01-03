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

    const pvtKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const starkPublicKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }

    const amount = 100
    const token = 'ZRX'

    nock('https://app.stg.deversifi.com/')
      .post('/v1/trading/w/deposit', body => {
        return (
          _.isMatch(body, {
            amount: amount,
            token: token,
            starkPublicKey: starkPublicKey
          }) && body.starkSignature
        )
      })
      .reply(200, apiResponse)

    const result = await dvf.deposit(token, amount, starkKeyPair)
    expect(result).toEqual(apiResponse)

    done()
  })

  it('Gives error for deposit with value of 0', async done => {
    const pvtKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const starkPublicKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }

    const amount = 0
    const token = 'ZRX'

    const result = await dvf.deposit(token, amount, starkKeyPair)
    expect(result.error).toEqual('ERR_AMOUNT_MISSING')

    done()
  })

  it('Gives error if token is missing', async done => {
    const pvtKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const starkPublicKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }

    const amount = 57
    const token = ''

    const result = await dvf.deposit(token, amount, starkKeyPair)
    expect(result.error).toEqual('ERR_TOKEN_MISSING')

    done()
  })

  it('Gives error if token is not supported', async done => {
    const pvtKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const starkPublicKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }

    const amount = 57
    const token = 'XYZ'

    const result = await dvf.deposit(token, amount, starkKeyPair)
    expect(result.error).toEqual('ERR_INVALID_TOKEN')

    done()
  })
})
