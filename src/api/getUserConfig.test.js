const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('getUserConfig', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
  })

  it('Returns the user config recieved from the API', async done => {
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
          starkTokenId: '0x1',
          starkVaultId: 1251434240
        },
        USD: {
          decimals: 6,
          minOrderSize: 25,
          settleSpread: -0.026,
          starkTokenId: '0x2',
          tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          starkVaultId: 9876512
        },
        ZRX: {
          decimals: 18,
          minOrderSize: 40,
          starkTokenId:
            '22e6d888f32dea3c6e8ba64609a314eebbe1eb704e9e9febe368b0bacb21efe',
          tokenAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498',
          starkVaultId: 12345
        }
      },
      spareStarkVaultId: 1599136128,
      ethAddress: '0x41c3df418b1a9dc20b4ad1da1a740d16519fba4d'
    }

    nock('https://app.stg.deversifi.com/')
      .post('/v1/trading/r/getUserConf', body => body.nonce && body.signature)
      .reply(200, apiResponse)

    const config = await dvf.getUserConfig()
    expect(config).toEqual(apiResponse)

    done()
  })
})
