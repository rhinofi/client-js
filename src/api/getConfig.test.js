const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.getConfig', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it('Returns the config received from the API', async () => {
    const apiResponse = {
      DVF: {
        defaultFeeRate: 0.0025,
        exchangeAddress: '0xBd25cD867C304F079E696CBE44D958f3d3B683ba',
        starkExContractAddress: '0xA9F9cC1189b9d6051b26467b29629787C671905d',
        exchangeSymbols: ['ETH:USDT', 'ZRX:USDT', 'ZRX:ETH'],
        tempStarkVaultId: 1
      },
      tokenRegistry: {
        ETH: {
          decimals: 18,
          quantization: 10000000000,
          minOrderSize: 0.05,
          settleSpread: 0,
          starkTokenId:
            '0xb333e3142fe16b78628f19bb15afddaef437e72d6d7f5c6c20c6801a27fba6'
        },
        USDT: {
          decimals: 6,
          quantization: 1,
          minOrderSize: 10,
          settleSpread: 0,
          starkTokenId:
            '0x180bef8ae3462e919489763b84dc1dc700c45a249dec4d1136814a639f2dd7b',
          tokenAddress: '0x4c5f66596197a86fb30a2435e2ef4ddcb39342c9'
        },
        ZRX: {
          decimals: 18,
          quantization: 10000000000,
          minOrderSize: 20,
          settleSpread: 0,
          starkTokenId:
            '0x3901ee6a6c5ac0f6e284f4273b961b7e9f29d25367d31d90b75820473a202f7',
          tokenAddress: '0xcd077abedd831a3443ffbe24fb76661bbb17eb69'
        },
        BTC: {
          decimals: 18,
          quantization: 10000000000,
          minOrderSize: 0.0004,
          settleSpread: 0,
          starkTokenId:
            '0x21ef21d6b234cd669edd702dd3d1d017be888337010b950ae3679eb4194b4bc',
          tokenAddress: '0x40d8978500bf68324a51533cd6a21e3e59be324a'
        }
      }
    }

    nock(dvf.config.api)
      .post('/v1/trading/r/getConf', {})
      .reply(200, apiResponse)

    const config = await dvf.getConfig()
    expect(config).toEqual(apiResponse)
  })

  it('Posts to config API and gets error response', async () => {
    const apiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message:
        'Please contact support if you believe there should not be an error here',
      details: {
        name: 'RequestError',
        message: 'Error: connect ECONNREFUSED 127.0.0.1:2222'
      }
    }

    nock(dvf.config.api)
      .post('/v1/trading/r/getConf')
      .reply(5000, apiErrorResponse)

    try {
      await dvf.getConfig()
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
    }
  })

  it('Handles error in getting config during initialisation', async () => {
    const apiErrorResponse = {
      statusCode: 404,
      error:
        'response 404 (backend NotFound), service rules for [ /v1/trading/r/getConf ] non-existent',
      message:
        '404 - "response 404 (backend NotFound), service rules for [ /v1/trading/r/getConf ] non-existent"',
      details: {
        name: 'StatusCodeError',
        statusCode: 404,
        message:
          '404 - "response 404 (backend NotFound), service rules for [ /v1/trading/r/getConf ] non-existent"',
        error:
          'response 404 (backend NotFound), service rules for [ /v1/trading/r/getConf ] non-existent'
      }
    }

    nock(dvf.config.api)
      .post('/v1/trading/r/getConf')
      .reply(404, apiErrorResponse)

    const response = await dvf.getConfig()

    expect(response).toMatchObject({
      api: 'https://api.stg.deversifi.com',
      gasApi: 'https://ethgasstation.info',
      defaultGasLimit: 300000, // defined in `/src/config.js`
      defaultGasPrice: 500000000,
      defaultStarkExpiry: 4320,
      defaultNonceAge: 43200,
      defaultProvider: 'http://localhost:8545',
      account: 0,
      autoSelectAccount: true,
      purpose: 2645,
      plugin: 579218131,
      application: 1393043894,
      accountIndex: 0,
      autoLoadUserConf: true,
      autoLoadExchangeConf: true
    })
  })
})
