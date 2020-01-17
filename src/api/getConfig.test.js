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
          tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7'
        },
        ZRX: {
          decimals: 18,
          minOrderSize: 40,
          starkTokenId:
            '22e6d888f32dea3c6e8ba64609a314eebbe1eb704e9e9febe368b0bacb21efe',
          tokenAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498'
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
