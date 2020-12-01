const nock = require('nock')
const instance = require('../test/helpers/instance')
const mockGetConf = require('../test/fixtures/getConf')

jest.mock('../../lib/ledger/selectTransport')
const mockSelector = require('../../lib/ledger/selectTransport')
const {createTransportReplayer} = require('@ledgerhq/hw-transport-mocker')
const mockEth = require('@ledgerhq/hw-app-eth')
jest.mock('@ledgerhq/hw-app-eth', () => {
  return {
    default: jest.fn(() => mockEth),
    getAddress: jest.fn(() => {
      return {
        address: '0x341e46a49f15785373ede443df0220dea6a41bbc'
      }
    }),
    starkGetPublicKey: jest.fn(() => '0401841559c5a886771644573dbb6dba210a1a7a0834afcf6bb3cbba1565ae7b3202f0f543d1b6666fa1e093b5d03feb90f0e68ab007baf587b6285d425d8a34dc'),
    provideERC20TokenInformation: jest.fn(() => true),
    starkProvideQuantum: jest.fn(() => true),
    starkSignTransfer: jest.fn(() => {
      return {
        r: '06519b47cc1c5a2731420d824cce3a1a42fcbe3a4b0614187603474255a7332c',
        s: '01f1ae85334d2a2aea2e3ec2e79f42c6397dd97fc72332a0b1e948cb82e2d3ef'
      }
    })
  }
})

const Transport = createTransportReplayer()
let dvf

describe('dvf.deposit', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Deposits ETH to users vault', async () => {
    mockGetConf()
    const path = '44\'/60\'/0\'/0\'/0'
    const token = 'ETH'
    const amount = '1.2'
    const starkPublicKey = {
      x: '01841559c5a886771644573dbb6dba210a1a7a0834afcf6bb3cbba1565ae7b32',
      y: '02f0f543d1b6666fa1e093b5d03feb90f0e68ab007baf587b6285d425d8a34dc'
    }
    const apiResponse = {
      token,
      amount,
      starkPublicKey
    }

    mockSelector.mockImplementation(() => { return Transport })

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(apiResponse)
      expect(typeof body.nonce).toBe('number')
      expect(body.starkSignature.r).toMatch(/[\da-f]/i)
      expect(body.starkSignature.s).toMatch(/[\da-f]/i)
      expect(typeof body.starkVaultId).toBe('number')
      expect(typeof body.expireTime).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit', payloadValidator)
      .reply(200, apiResponse)

    await dvf.ledger.deposit(token, amount, path)

    expect(payloadValidator).toBeCalled()
  })

  it('Deposits ERC20 token to user\'s vault', async () => {
    mockGetConf()
    const path = '44\'/60\'/0\'/0\'/0'
    const amount = '193.33'
    const token = 'USDT'
    const starkPublicKey = {
      x: '01841559c5a886771644573dbb6dba210a1a7a0834afcf6bb3cbba1565ae7b32',
      y: '02f0f543d1b6666fa1e093b5d03feb90f0e68ab007baf587b6285d425d8a34dc'
    }

    const apiResponse = {
      token,
      amount,
      starkPublicKey
    }

    mockSelector.mockImplementation(() => { return Transport })

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(apiResponse)
      expect(typeof body.nonce).toBe('number')
      expect(body.starkSignature.r).toMatch(/[\da-f]/i)
      expect(body.starkSignature.s).toMatch(/[\da-f]/i)
      expect(typeof body.starkVaultId).toBe('number')
      expect(typeof body.expireTime).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit', payloadValidator)
      .reply(200, apiResponse)

    await dvf.ledger.deposit(token, amount, path)

    expect(payloadValidator).toBeCalled()
  })

  it('Deposit corrects decimals to common standard', async () => {
    mockGetConf()
    const path = '44\'/60\'/0\'/0\'/0'
    const amount = '1.1234567891'
    const token = 'ETH'
    const starkPublicKey = {
      x: '01841559c5a886771644573dbb6dba210a1a7a0834afcf6bb3cbba1565ae7b32',
      y: '02f0f543d1b6666fa1e093b5d03feb90f0e68ab007baf587b6285d425d8a34dc'
    }

    const apiResponse = {
      token,
      amount: '1.12345678',
      starkPublicKey
    }

    mockSelector.mockImplementation(() => { return Transport })

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(apiResponse)
      expect(typeof body.nonce).toBe('number')
      expect(body.starkSignature.r).toMatch(/[\da-f]/i)
      expect(body.starkSignature.s).toMatch(/[\da-f]/i)
      expect(typeof body.starkVaultId).toBe('number')
      expect(typeof body.expireTime).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/deposit', payloadValidator)
      .reply(200, apiResponse)

    await dvf.ledger.deposit(token, amount, path)

    expect(payloadValidator).toBeCalled()
  })
})
