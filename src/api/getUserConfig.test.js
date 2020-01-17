const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('getUserConfig', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Returns the user config recieved from the API', async done => {
    const apiResponse = {
      DVF: {
        exchangeSymbols: ['tETHUSD', 'tZRXUSD', 'tZRXETH'],
        exchangeAddress: '0xBd25cD867C304F079E696CBE44D958f3d3B683ba',
        starkExContractAddress: '0xF3731d0cdC9834f6F32104580bD226EF1bc1A9F9',
        tempStarkVaultId: 1,
        depositExpiry: 720,
        depositNonce: 1
      },
      tokenRegistry: {
        ETH: {
          decimals: 18,
          minOrderSize: 0.1,
          starkTokenId: '0x1',
          starkVaultId: 1251434240
        },
        USDT: {
          decimals: 6,
          tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          minOrderSize: 25,
          settleSpread: -0.026,
          starkTokenId: '0x2',
          starkVaultId: 9876512
        },
        ZRX: {
          decimals: 16,
          tokenAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498',
          minOrderSize: 40,
          starkTokenId:
            '0x22e6d888f32dea3c6e8ba64609a314eebbe1eb704e9e9febe368b0bacb21efe',
          starkVaultId: 1771994328
        }
      },
      spareStarkVaultId: 2090569095,
      ethAddress: '0xf858c2f2ac6b96df8c801bce90a3124a52d1915a'
    }

    nock(dvf.config.api)
      .post('/v1/trading/r/getUserConf', body => body.nonce && body.signature)
      .reply(200, apiResponse)

    const config = await dvf.getUserConfig()
    console.log(config)
    expect(config).toMatchObject(apiResponse)

    done()
  })
})
