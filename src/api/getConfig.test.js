const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')
const mockGetUserConf = require('./test/fixtures/getUserConf')

let dvf

describe('getConfig', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGetUserConf()
    dvf = await instance()
  })

  it('Returns the config recieved from the API', async done => {
    const apiResponse = {
      DVF: {
        exchangeSymbols: ['tETHUSD', 'tZRXUSD', 'tZRXETH'],
        exchangeAddress: '0xBd25cD867C304F079E696CBE44D958f3d3B683ba'
      },
      tokenRegistry: {
        ETH: {
          decimals: 18,
          minOrderSize: 0.1,
          starkTokenId: '0x1'
        },
        USD: {
          decimals: 6,
          tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          minOrderSize: 25,
          settleSpread: -0.026,
          starkTokenId: '0x2'
        },
        ZRX: {
          decimals: 18,
          tokenAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498',
          minOrderSize: 40,
          starkTokenId:
            '0x22e6d888f32dea3c6e8ba64609a314eebbe1eb704e9e9febe368b0bacb21efe'
        }
      }
    }

    nock('https://app.stg.deversifi.com/')
      .post('/v1/trading/r/getConf', {})
      .reply(200, apiResponse)

    const config = await dvf.getConfig()
    expect(config).toEqual(apiResponse)

    done()
  })
})
