const nock = require('nock')
const instance = require('../test/helpers/instance')
const mockGetConf = require('../test/fixtures/getConf')
const Transport = require('@ledgerhq/hw-transport-node-hid').default
const Eth = require('@ledgerhq/hw-app-eth').default
const byContractAddress = require('@ledgerhq/hw-app-eth/erc20')
  .byContractAddress

let dvf

describe('dvf.deposit', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Deposits ETH to users vault', async () => {
    mockGetConf()
    const path = `44'/60'/0'/0'/0`
    const token = 'ETH'
    const amount = 1.2
    starkPublicKey = {
      x: '67ab7280c36ba5c977a574c7c03525614ed7be5445ef261bd7b10e506c57119',
      y: '00c3b334e8b109e0427fc88070154458f966ae9ff5a91a058d574a96c24adc23'
    }
    const apiResponse = {
      token,
      amount,
      starkPublicKey
    }

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

    const starkDeposit = await dvf.stark.ledger.createDepositData(
      path,
      token,
      amount
    )
    await dvf.ledger.deposit(token, amount, starkDeposit)

    expect(payloadValidator).toBeCalled()
  })

  it(`Deposits ERC20 token to user's vault`, async () => {
    mockGetConf()
    const path = `44'/60'/0'/0'/0`
    const amount = 193
    const token = 'USDT'
    const starkPublicKey = {
      x: '67ab7280c36ba5c977a574c7c03525614ed7be5445ef261bd7b10e506c57119',
      y: '00c3b334e8b109e0427fc88070154458f966ae9ff5a91a058d574a96c24adc23'
    }

    const apiResponse = {
      token,
      amount,
      starkPublicKey
    }

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

    const starkDeposit = await dvf.stark.ledger.createDepositData(
      path,
      token,
      amount
    )
    await dvf.ledger.deposit(token, amount, starkDeposit)

    expect(payloadValidator).toBeCalled()
  })
})
