const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.withdrawV2', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it(`Withdraws ERC20 token to user's vault`, async () => {
    const amount = 1394.0000051
    const token = 'USDT'

    const expectedPayload = {
      amount: '1394000005',
      token
    }

    const mockedApiResponse = {
      ...expectedPayload,
      readyToWithdrawOnChain: false
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(expectedPayload)
      expect(typeof body.nonce).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/withdrawals', payloadValidator)
      .reply(200, mockedApiResponse)

    await dvf.withdrawV2({ token, amount })

    expect(payloadValidator).toBeCalled()
  })

  it('Withdraws ETH to users vault', async () => {
    const amount = 1.1177777777
    const token = 'ETH'

    const expectedPayload = {
      // Amount for ETH is quantised to 8 decimals, rounded down
      amount: '111777777',
      token
    }

    const mockedApiResponse = {
      ...expectedPayload,
      readyToWithdrawOnChain: false
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(expectedPayload)
      expect(typeof body.nonce).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/withdrawals', payloadValidator)
      .reply(200, mockedApiResponse)

    await dvf.withdrawV2({ token, amount })

    expect(payloadValidator).toBeCalled()
  })

  it('Withdraws ETH to users vault taking input nonce', async () => {
    const token = 'ETH'
    const amount = '1.117'
    const nonce = 1559

    const expectedPayload = {
      amount: '111700000',
      token,
      nonce
    }

    const mockedApiResponse = {
      ...expectedPayload,
      readyToWithdrawOnChain: false
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(expectedPayload)
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/withdrawals', payloadValidator)
      .reply(200, mockedApiResponse)

    await dvf.withdrawV2({ token, amount, nonce })

    expect(payloadValidator).toBeCalled()
  })

  it('Gives error for withdrawal with value of 0', async () => {
    const amount = 0
    const token = 'ZRX'

    expect(dvf.withdrawV2({ token, amount })).rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error if token is missing', async () => {
    const amount = 57
    const token = ''

    expect(dvf.withdrawV2({ token, amount })).rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error if token is not supported', async () => {
    const amount = 57
    const token = 'NOT'

    expect(dvf.withdrawV2({ token, amount })).rejects
      .toThrow('ERR_INVALID_TOKEN')
  })

  it('Posts to withdrawal API and gets error response', async () => {
    const apiErrorResponse = {
      statusCode: 422,
      error: 'Unprocessable Entity',
      message:
        'Please contact support if you believe there should not be an error here',
      details: {
        error: {
          type: 'DVFError',
          message: 'MUST_REGISTER'
        }
      }
    }

    nock(dvf.config.api)
      .post('/v1/trading/withdrawals')
      .reply(422, apiErrorResponse)

    expect(dvf.withdrawV2({
      token: 'ZRX',
      amount: 31
    })).rejects.toThrow({ error: apiErrorResponse })
  })
})
