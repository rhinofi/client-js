const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

const sw = require('starkware_crypto')
const _ = require('lodash')

let dvf

describe('registers', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
  })

  it('Registers user with Stark Ex', async done => {
    const apiResponse = { register: 'success' }

    const pvtKey =
      '0x2111111111111111111111111111111111111111111111111111111111111111'
    const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
    const fullPublicKey = sw.ec.keyFromPublic(
      starkKeyPair.getPublic(true, 'hex'),
      'hex'
    )

    const starkKey = fullPublicKey.pub.getX().toString('hex')
    const ethAddress = '0x341E46a49F15785373edE443Df0220DEa6a41Bbc'
    nonce = 'nonce'
    signature =
      '0x321ac89402c444ccf83952795ab10d561bc3749020c10a7ab5f77f24287fd713032d7bf1097bfa589b077050a3a9bbb68b0fce610f5ef79cfb7b7bd0d04825ce00'

    console.log({ starkKey, ethAddress })
    nock('https://app.stg.deversifi.com/')
      .post('/v1/trading/w/register', body => {
        return _.isMatch(body, {
          starkKey: starkKey,
          nonce: nonce,
          signature: signature
        })
      })
      .reply(200, apiResponse)

    const result = await dvf.register(starkKey, nonce, signature)
    expect(result).toEqual(apiResponse)

    done()
  })

  // it('Gives error for deposit with value of 0', async done => {
  //   const pvtKey =
  //     '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
  //   const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
  //   const fullPublicKey = sw.ec.keyFromPublic(
  //     starkKeyPair.getPublic(true, 'hex'),
  //     'hex'
  //   )
  //   const starkPublicKey = {
  //     x: fullPublicKey.pub.getX().toString('hex'),
  //     y: fullPublicKey.pub.getY().toString('hex')
  //   }

  //   const amount = 0
  //   const token = 'ZRX'

  //   const result = await dvf.deposit(token, amount, starkKeyPair)
  //   expect(result.error).toEqual('ERR_AMOUNT_MISSING')

  //   done()
  // })

  // it('Gives error if token is missing', async done => {
  //   const pvtKey =
  //     '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
  //   const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
  //   const fullPublicKey = sw.ec.keyFromPublic(
  //     starkKeyPair.getPublic(true, 'hex'),
  //     'hex'
  //   )
  //   const starkPublicKey = {
  //     x: fullPublicKey.pub.getX().toString('hex'),
  //     y: fullPublicKey.pub.getY().toString('hex')
  //   }

  //   const amount = 57
  //   const token = ''

  //   const result = await dvf.deposit(token, amount, starkKeyPair)
  //   expect(result.error).toEqual('ERR_TOKEN_MISSING')

  //   done()
  // })

  // it('Gives error if token is not supported', async done => {
  //   const pvtKey =
  //     '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
  //   const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
  //   const fullPublicKey = sw.ec.keyFromPublic(
  //     starkKeyPair.getPublic(true, 'hex'),
  //     'hex'
  //   )
  //   const starkPublicKey = {
  //     x: fullPublicKey.pub.getX().toString('hex'),
  //     y: fullPublicKey.pub.getY().toString('hex')
  //   }

  //   const amount = 57
  //   const token = 'XYZ'

  //   const result = await dvf.deposit(token, amount, starkKeyPair)
  //   expect(result.error).toEqual('ERR_INVALID_TOKEN')

  //   done()
  // })
})
