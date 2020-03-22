const nock = require('nock')
const instance = require('../test/helpers/instance')

const mockGetConf = require('../test/fixtures/getConf')

const sw = require('starkware_crypto')
const _ = require('lodash')

let dvf

describe('dvf.deposit', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it.skip(`Deposits ERC20 token to user's vault`, async () => {
    mockGetConf()
    const path = `21323'/0`
    const amount = 231
    const token = 'USDT'
    const starkPublicKey = {
      x: '0615a13d3f18d240a1ad98ba9c12ac7b70361a547284b55a35c82f2c2d4515cd'
    }

    const apiResponse = {
      token,
      amount,
      starkPublicKey
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(apiResponse)
      expect(typeof body.nonce).toBe('number')
      expect(body.starkSignature).toMatch(/[\da-f]/i)
      expect(typeof body.starkVaultId).toBe('number')
      expect(typeof body.expireTime).toBe('number')
      expect(body.ethTxHash).toMatch(/[\da-f]/i)
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit', payloadValidator)
      .reply(200, apiResponse)

    await dvf.ledger.deposit(token, amount, path)

    expect(payloadValidator).toBeCalled()
  })

  it('Deposits ETH to users vault', async () => {
    mockGetConf()

    const path = `21323'/0`
    const token = 'ETH'
    const amount = 1.117
    const apiResponse = {
      token,
      amount,
      starkPublicKey: {
        x: '0615a13d3f18d240a1ad98ba9c12ac7b70361a547284b55a35c82f2c2d4515cd'
      }
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(apiResponse)
      expect(typeof body.nonce).toBe('number')
      expect(body.starkSignature).toMatch(/[\da-f]/i)
      expect(typeof body.starkVaultId).toBe('number')
      expect(typeof body.expireTime).toBe('number')
      expect(body.ethTxHash).toMatch(/[\da-f]/i)
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit', payloadValidator)
      .reply(200, apiResponse)

    await dvf.ledger.deposit(token, amount, path)

    expect(payloadValidator).toBeCalled()
  })
})
