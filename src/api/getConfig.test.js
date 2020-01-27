const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('getConfig', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Returns the config recieved from the API', async done => {
    const apiResponse = {
      DVF: {
        depositExpiry: 720,
        depositNonce: 1,
        exchangeAddress: '0xBd25cD867C304F079E696CBE44D958f3d3B683ba',
        starkExContractAddress: '0xF3731d0cdC9834f6F32104580bD226EF1bc1A9F9',
        exchangeSymbols: ['tETHUSD', 'tZRXUSD', 'tZRXETH'],
        tempStarkVaultId: 1
      },
      tokenRegistry: {
        ETH: {
          decimals: 18,
          minOrderSize: 0.1,
          starkTokenId: '0x1'
        },
        USD: {
          decimals: 6,
          minOrderSize: 25,
          settleSpread: -0.026,
          starkTokenId: '0x2',
          tokenAddress: '0x4c5f66596197a86fb30a2435e2ef4ddcb39342c9'
        },
        ZRX: {
          decimals: 18,
          minOrderSize: 40,
          starkTokenId: '0x3',
          tokenAddress: '0xcd077abedd831a3443ffbe24fb76661bbb17eb69'
        },
        BTC: {
          decimals: 18,
          minOrderSize: 0.0001,
          starkTokenId: '0x4',
          tokenAddress: '0x40d8978500bf68324a51533cd6a21e3e59be324a'
        }
      },
      spareStarkVaultId: 866076352
    }

    nock(dvf.config.api)
      .post('/v1/trading/r/getConf', {})
      .reply(200, apiResponse)

    const config = await dvf.getConfig()
    expect(config).toEqual(apiResponse)

    done()
  })
})
