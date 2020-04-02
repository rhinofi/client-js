const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.getConfig', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('Returns the config recieved from the API', async () => {
    const apiResponse = {
      DVF: {
        defaultFeeRate: 0.0025,
        exchangeAddress: '0xBd25cD867C304F079E696CBE44D958f3d3B683ba',
        starkExContractAddress: '0x45F5d63b5074E3710760A9A8ecCF96e58F9e11c7',
        exchangeSymbols: ['tETHUSD', 'tZRXUSD', 'tZRXETH'],
        tempStarkVaultId: 1
      },
      tokenRegistry: {
        ETH: {
          decimals: 18,
          quantization: 10000000000,
          minOrderSize: 0.1,
          starkTokenId:
            '0xb333e3142fe16b78628f19bb15afddaef437e72d6d7f5c6c20c6801a27fba6'
        },
        USDT: {
          decimals: 6,
          quantization: 1,
          minOrderSize: 25,
          settleSpread: -0.026,
          starkTokenId:
            '0x180bef8ae3462e919489763b84dc1dc700c45a249dec4d1136814a639f2dd7b',
          tokenAddress: '0x4c5f66596197a86fb30a2435e2ef4ddcb39342c9'
        },
        ZRX: {
          decimals: 18,
          quantization: 10000000000,
          minOrderSize: 40,
          starkTokenId:
            '0x3901ee6a6c5ac0f6e284f4273b961b7e9f29d25367d31d90b75820473a202f7',
          tokenAddress: '0xcd077abedd831a3443ffbe24fb76661bbb17eb69'
        },
        BTC: {
          decimals: 18,
          quantization: 10000000000,
          minOrderSize: 0.0001,
          starkTokenId:
            '0x21ef21d6b234cd669edd702dd3d1d017be888337010b950ae3679eb4194b4bc',
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
      .reply(422, apiErrorResponse)

    try {
      await dvf.getConfig()
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
    }
  })
})
