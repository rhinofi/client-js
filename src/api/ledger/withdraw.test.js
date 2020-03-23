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

  it('Withdrawas ETH to users vault', async () => {
    mockGetConf()
    const path = `21323'/0`
    const token = 'ETH'
    const amount = 1.117
    starkPublicKey = {
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
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/withdraw', payloadValidator)
      .reply(200, apiResponse)

    const starkWithdrawal = await dvf.stark.ledger.createWithdrawalData(
      path,
      token,
      amount
    )
    await dvf.ledger.withdraw(token, amount, starkWithdrawal)

    expect(payloadValidator).toBeCalled()
  })

  it(`Withdrawas ERC20 token to user's vault`, async () => {
    mockGetConf()
    const path = `21323'/0`
    const amount = 193
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
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/withdraw', payloadValidator)
      .reply(200, apiResponse)

    const starkWithdrawal = await dvf.stark.ledger.createWithdrawalData(
      path,
      token,
      amount
    )
    await dvf.ledger.withdraw(token, amount, starkWithdrawal)

    expect(payloadValidator).toBeCalled()
  })
})
