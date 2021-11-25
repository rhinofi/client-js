const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.getUserConfig', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it('Returns the user config recieved from the API', async () => {

    const apiResponse = {
      DVF: {
        exchangeSymbols: ['ETH:USDT', 'ZRX:USDT', 'ZRX:ETH'],
        exchangeAddress: '0xBd25cD867C304F079E696CBE44D958f3d3B683ba',
        starkExContractAddress: '0xA9F9cC1189b9d6051b26467b29629787C671905d',
        tempStarkVaultId: 1,
        defaultFeeRate: 0.0025
      },
      tokenRegistry: {
        ETH: {
          decimals: 18,
          quantization: 10000000000,
          minOrderSize: 0.05,
          settleSpread: 0,
          starkTokenId:
            '0xb333e3142fe16b78628f19bb15afddaef437e72d6d7f5c6c20c6801a27fba6',
          starkVaultId: 1000001
        },
        USDT: {
          decimals: 6,
          quantization: 1,
          minOrderSize: 10,
          settleSpread: 0,
          starkTokenId:
            '0x180bef8ae3462e919489763b84dc1dc700c45a249dec4d1136814a639f2dd7b',
          tokenAddress: '0x4c5f66596197a86fb30a2435e2ef4ddcb39342c9',
          starkVaultId: 1000002
        },
        ZRX: {
          decimals: 18,
          quantization: 10000000000,
          minOrderSize: 20,
          settleSpread: 0,
          starkTokenId:
            '0x3901ee6a6c5ac0f6e284f4273b961b7e9f29d25367d31d90b75820473a202f7',
          tokenAddress: '0xcd077abedd831a3443ffbe24fb76661bbb17eb69',
          starkVaultId: 1000003
        },
        BTC: {
          decimals: 18,
          quantization: 10000000000,
          minOrderSize: 0.0004,
          settleSpread: 0,
          starkTokenId:
            '0x21ef21d6b234cd669edd702dd3d1d017be888337010b950ae3679eb4194b4bc',
          tokenAddress: '0x40d8978500bf68324a51533cd6a21e3e59be324a',
          starkVaultId: 1000004
        }
      },
      isRegistered: true,
      ethAddress: '0xf858c2f2ac6b96df8c801bce90a3124a52d1915a'
    }

    const payloadValidator = jest.fn(body => {
      expect(typeof body.nonce).toEqual('string')
      expect(typeof body.signature).toEqual('string')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/r/getUserConf', payloadValidator)
      .reply(200, apiResponse)

    const config = await dvf.getUserConfig()

    expect(payloadValidator).toBeCalled()
    expect(config).toMatchObject(apiResponse)
  })

  it('Posts to user config API and gets error response', async () => {
    const apiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message:
        'Please contact support if you believe there should not be an error here',
      details: {
        error: {
          type: 'DVFError',
          message: 'STARK_SIGNATURE_VERIFICATION_ERROR'
        }
      }
    }

    const payloadValidator = jest.fn(() => true)

    nock(dvf.config.api)
      .post('/v1/trading/r/getUserConf', payloadValidator)
      .reply(422, apiErrorResponse)

    try {
      await dvf.getUserConfig()
    } catch (e) {
      expect(e.error).toEqual(apiErrorResponse)
      expect(payloadValidator).toBeCalled()
    }
  })
})
