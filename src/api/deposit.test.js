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
    const amount = 1
    const token = 'ZRX'

    const starkPrivateKey = '100'
    const starkKeyPair = sw.ec.keyFromPrivate(starkPrivateKey, 'hex')
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

    const result = await dvf.deposit(token, amount, starkPrivateKey)
    //console.log({ result })
    expect(result).toEqual(apiResponse)

    done()
  })

  // it('Deposits ETH to users vault', async done => {
  //   const amount = 0.01
  //   const token = 'ETH'

  //   const starkPrivateKey = '100'
  //   const starkKeyPair = sw.ec.keyFromPrivate(starkPrivateKey, 'hex')
  //   const fullPublicKey = sw.ec.keyFromPublic(
  //     starkKeyPair.getPublic(true, 'hex'),
  //     'hex'
  //   )
  //   const starkPublicKey = {
  //     x: fullPublicKey.pub.getX().toString('hex'),
  //     y: fullPublicKey.pub.getY().toString('hex')
  //   }
  //   const apiResponse = {
  //     token,
  //     amount,
  //     starkPublicKey
  //   }

  //   nock(dvf.config.api)
  //     .post('/v1/trading/w/deposit', body => {
  //       //console.log({ body })
  //       return (
  //         _.isMatch(body, {
  //           token: token,
  //           amount: amount,
  //           starkPublicKey: starkPublicKey
  //         }) &&
  //         body.starkSignature &&
  //         body.starkVaultId
  //       )
  //     })
  //     .reply(200, apiResponse)

  //   const result = await dvf.deposit(token, amount, starkPrivateKey)
  //   //console.log({ result })
  //   expect(result).toEqual(apiResponse)

  //   done()
  // })

  // it('Gives error for deposit with value of 0', async done => {
  //   const starkPrivateKey =
  //     '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
  //   const amount = 0
  //   const token = 'ZRX'

  //   const result = await dvf.deposit(token, amount, starkPrivateKey)
  //   expect(result.error).toEqual('ERR_AMOUNT_MISSING')

  //   done()
  // })

  // it('Gives error if token is missing', async done => {
  //   const starkPrivateKey =
  //     '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
  //   const amount = 57
  //   const token = ''

  //   const result = await dvf.deposit(token, amount, starkPrivateKey)
  //   expect(result.error).toEqual('ERR_TOKEN_MISSING')

  //   done()
  // })

  // it('Gives error if token is not supported', async done => {
  //   const starkPrivateKey =
  //     '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
  //   const amount = 57
  //   const token = 'XYZ'

  //   const result = await dvf.deposit(token, amount, starkPrivateKey)
  //   expect(result.error).toEqual('ERR_INVALID_TOKEN')

  //   done()
  // })

  // it('Gives error if starkPrivateKey is not supported', async done => {
  //   const starkPrivateKey = ''
  //   const amount = 57
  //   const token = 'ZRX'

  //   const result = await dvf.deposit(token, amount, starkPrivateKey)
  //   expect(result.error).toEqual('ERR_STARK_PRIVATE_KEY_MISSING')

  //   done()
  // })
})
