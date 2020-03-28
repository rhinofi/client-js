const instance = require('../../../api/test/helpers/instance')
const mockGetConf = require('../../../api/test/fixtures/getConf')

let dvf

describe('dvf.stark.ledger.createOrderMetaData', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('creates all data parameters required for a BUY order for Ledger wallet', async () => {
    const path = `21323'/0`
    const symbol = 'ETH:USDT' // symbol,
    const amount = '5' // amount,
    const price = 150 // price,
    const expectedResult = {
      symbol,
      amount,
      price,
      starkOrder: {
        vaultIdSell: dvf.config.tokenRegistry['USDT'].starkVaultId,
        vaultIdBuy: dvf.config.tokenRegistry['ETH'].starkVaultId,
        tokenSell: dvf.config.tokenRegistry['USDT'].starkTokenId,
        tokenBuy: dvf.config.tokenRegistry['ETH'].starkTokenId
      }
    }

    const payloadValidator = jest.fn(result => {
      expect(result).toMatchObject(expectedResult)

      expect(result.starkOrder.amountSell).toMatch(/^[1-9][0-9]*$/i)
      expect(result.starkOrder.amountBuy).toMatch(/^[1-9][0-9]*$/i)
      expect(typeof result.starkOrder.expirationTimestamp).toBe('number')
      expect(typeof result.starkOrder.nonce).toBe('number')

      expect(result.starkMessage).toMatch(/[\da-f]/i)

      expect(result.starkPublicKey.x).toMatch(/[\da-f]/i)
      expect(result.starkPublicKey.y).toMatch(/[\da-f]/i)

      expect(result.starkSignature.r).toMatch(/[\da-f]/i)
      expect(result.starkSignature.s).toMatch(/[\da-f]/i)

      return true
    })

    try {
      const orderMetaData = await dvf.stark.ledger.createOrderMetaData(
        symbol,
        amount,
        price,
        '0', // validFor
        '', // feeRate
        path
      )
      payloadValidator(orderMetaData)
    } catch (e) {
      console.log('error occurred: ', e.message)
    }
    expect(payloadValidator).toBeCalled()
  })

  it('creates all data parameters required for a SELL order for Ledger wallet', async () => {
    const path = `21323'/0`
    const symbol = 'ZRX:ETH' // symbol,
    const amount = '-55' // amount,
    const price = 0.01 // price,
    const expectedResult = {
      symbol,
      amount,
      price,
      starkOrder: {
        vaultIdSell: dvf.config.tokenRegistry['ZRX'].starkVaultId,
        vaultIdBuy: dvf.config.tokenRegistry['ETH'].starkVaultId,
        tokenSell: dvf.config.tokenRegistry['ZRX'].starkTokenId,
        tokenBuy: dvf.config.tokenRegistry['ETH'].starkTokenId
      }
    }

    const payloadValidator = jest.fn(result => {
      expect(result).toMatchObject(expectedResult)

      expect(result.starkOrder.amountSell).toMatch(/^[1-9][0-9]*$/i)
      expect(result.starkOrder.amountBuy).toMatch(/^[1-9][0-9]*$/i)
      expect(typeof result.starkOrder.expirationTimestamp).toBe('number')
      expect(typeof result.starkOrder.nonce).toBe('number')

      expect(result.starkMessage).toMatch(/[\da-f]/i)

      expect(result.starkPublicKey.x).toMatch(/[\da-f]/i)
      expect(result.starkPublicKey.y).toMatch(/[\da-f]/i)

      expect(result.starkSignature.r).toMatch(/[\da-f]/i)
      expect(result.starkSignature.s).toMatch(/[\da-f]/i)

      return true
    })

    try {
      const orderMetaData = await dvf.stark.ledger.createOrderMetaData(
        symbol,
        amount,
        price,
        '0', // validFor
        '', // feeRate
        path
      )
      payloadValidator(orderMetaData)
    } catch (e) {
      console.log('error occurred: ', e.message)
    }
    expect(payloadValidator).toBeCalled()
  })
})
