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
    await dvf.getUserConfig()
  })

  it('Deposits ERC20 token to users vault', async done => {
    //1
    //1000000000000000000
    //18000000000000000000
    const amount = 1
    const token = 'ZRX'

    const pvtKey = '100'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const starkPublicKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }
    const apiResponse = {
      token,
      amount,
      starkPublicKey
    }

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit', body => {
        //console.log({ body })
        return (
          _.isMatch(body, apiResponse) &&
          body.starkSignature &&
          body.starkVaultId
        )
      })
      .reply(200, apiResponse)

    const result = await dvf.deposit(token, amount, pvtKey)
    //console.log({ result })
    expect(result).toEqual(apiResponse)

    done()
  })

  it('Deposits ETH to users vault', async done => {
    //1
    //1000000000000000000
    //18000000000000000000
    const amount = 0.01
    const token = 'ETH'

    const pvtKey = '100'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )
    const starkPublicKey = {
      x: fullPublicKey.pub.getX().toString('hex'),
      y: fullPublicKey.pub.getY().toString('hex')
    }
    const apiResponse = {
      token,
      amount,
      starkPublicKey
    }

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit', body => {
        //console.log({ body })
        return (
          _.isMatch(body, {
            token: token,
            amount: amount,
            starkPublicKey: starkPublicKey
          }) &&
          body.starkSignature &&
          body.starkVaultId
        )
      })
      .reply(200, apiResponse)

    const result = await dvf.deposit(token, amount, pvtKey)
    //console.log({ result })
    expect(result).toEqual(apiResponse)

    done()
  })

  it('Gives error for deposit with value of 0', async done => {
    const pvtKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const amount = 0
    const token = 'ZRX'

    const result = await dvf.deposit(token, amount, pvtKey)
    expect(result.error).toEqual('ERR_AMOUNT_MISSING')

    done()
  })

  it('Gives error if token is missing', async done => {
    const pvtKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const amount = 57
    const token = ''

    const result = await dvf.deposit(token, amount, pvtKey)
    expect(result.error).toEqual('ERR_TOKEN_MISSING')

    done()
  })

  it('Gives error if token is not supported', async done => {
    const pvtKey =
      '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
    const amount = 57
    const token = 'XYZ'

    const result = await dvf.deposit(token, amount, pvtKey)
    expect(result.error).toEqual('ERR_INVALID_TOKEN')

    done()
  })

  it('Gives error if pvtKey is not supported', async done => {
    const pvtKey = ''
    const amount = 57
    const token = 'ZRX'

    const result = await dvf.deposit(token, amount, pvtKey)
    expect(result.error).toEqual('ERR_STARK_PRIVATE_KEY_MISSING')

    done()
  })
})
