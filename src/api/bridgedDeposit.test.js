const nock = require('nock')
const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')

let dvf
let ethSendMock
let ethCallMock
// Stubs the 'send' function for blockchain transactions and returns
// chosen status and tx hash
const stubDvfEthSend = (dvfEth, { stubTxHash, status = true }) => {
  ethSendMock = jest.spyOn(dvfEth, 'send')
    .mockImplementation(async (abi, address, action, args, value, options) => {
      options.transactionHashCb(null, stubTxHash)
      return { status }
    })
  return ethSendMock
}

// For approvals
const stubDvfEthCall = (dvfEth, stubResponse = '100000000000000000000000') => {
  ethCallMock = jest.spyOn(dvfEth, 'call')
    .mockImplementation(async () => stubResponse)
  return ethCallMock
}

describe('dvf.bridgedDeposit', () => {
  let stubTxHash, stubSendFn
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    stubTxHash = '0x123456'
    stubDvfEthCall(dvf.eth)
    stubSendFn = stubDvfEthSend(dvf.eth, { stubTxHash })
    nock.cleanAll()
  })

  afterEach(() => {
    ethSendMock.mockReset()
  })

  afterAll(() => {
    ethSendMock.mockRestore()
  })

  it(`Deposits ERC20 token to user's vault`, async () => {
    const chain = 'MATIC_POS'
    const amount = '1394.0000051'
    const token = 'USDT'

    const expectedPayload = {
      chain,
      token,
      amount: '1394000005',
      txHash: stubTxHash
    }

    const apiResponse = {
      ...expectedPayload,
      pending: true,
      expiresAt: (new Date()).toString()
    }

    const payloadValidator = jest.fn((body) => {
      expect(body).toMatchObject(expectedPayload)
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/bridgedDeposits', payloadValidator)
      .reply(200, apiResponse)

    await dvf.bridgedDeposit({ chain, token, amount })

    expect(payloadValidator).toBeCalled()
    expect(stubSendFn.mock.calls.length).toBe(1)
  })

  it('Deposits ETH to users vault', async () => {
    mockGetConf()
    const chain = 'MATIC_POS'
    const token = 'ETH'
    const amount = '1.1177777777'

    const expectedPayload = {
      chain,
      token,
      amount: '111777777',
      txHash: stubTxHash
    }

    const apiResponse = {
      ...expectedPayload,
      pending: true,
      expiresAt: (new Date()).toString()
    }

    const payloadValidator = jest.fn((body) => {
      expect(body).toMatchObject(expectedPayload)
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/bridgedDeposits', payloadValidator)
      .reply(200, apiResponse)

    await dvf.bridgedDeposit({ chain, token, amount })

    expect(payloadValidator).toBeCalled()
    expect(stubSendFn.mock.calls.length).toBe(1)
  })

  it('Gives error for deposit with no chain', async () => {
    const amount = 1111
    const token = 'USDT'

    await expect(dvf.bridgedDeposit({ token, amount }))
      .rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error for deposit with unsupported token for chain', async () => {
    const chain = 'MATIC_POS'
    const amount = 1111
    const token = 'ZRX'

    await expect(dvf.bridgedDeposit({ chain, token, amount }))
      .rejects
      .toThrow('UNSUPPORTED_TOKEN_FOR_CHAIN')
  })

  it('Gives error for deposit with no amount', async () => {
    const chain = 'MATIC_POS'
    const token = 'USDT'

    await expect(dvf.bridgedDeposit({ chain, token })).rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error for deposit with value of 0', async () => {
    const chain = 'MATIC_POS'
    const amount = '0'
    const token = 'USDT'

    await expect(dvf.bridgedDeposit({ chain, token, amount }))
      .rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error if token is empty', async () => {
    const chain = 'MATIC_POS'
    const amount = '57'
    const token = ''

    await expect(dvf.bridgedDeposit({ chain, token, amount }))
      .rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error for deposit with no token', async () => {
    const chain = 'MATIC_POS'
    const amount = '57'

    await expect(dvf.bridgedDeposit({ chain, amount }))
      .rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error if token is not supported', async () => {
    const chain = 'MATIC_POS'
    const amount = '57'
    const token = 'NOT'

    await expect(dvf.bridgedDeposit({ chain, token, amount }))
      .rejects
      .toThrow('INVALID_TOKEN')
  })

  it('Posts to bridgedDeposit API and gets error response', async () => {
    const chain = 'MATIC_POS'
    const token = 'USDT'
    const amount = 31

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
      .post('/v1/trading/bridgedDeposits')
      .reply(422, apiErrorResponse)

    await expect(dvf.bridgedDeposit({ chain, token, amount }))
      .rejects
      .toThrow(apiErrorResponse.message)
  })

  it('Handles blockchain transaction error', async () => {
    const chain = 'MATIC_POS'
    const token = 'USDT'
    const amount = 31
    stubDvfEthSend(dvf.eth, { stubTxHash, status: false })

    const apiResponse = {
      chain,
      token: 'USDT',
      amount: '1394000005',
      txHash: stubTxHash,
      pending: true,
      expiresAt: (new Date()).toString()
    }
    nock(dvf.config.api)
      .post('/v1/trading/bridgedDeposits')
      .reply(200, apiResponse)

    await expect(dvf.bridgedDeposit({ chain, token, amount }))
      .rejects
      .toThrow('ERR_ONCHAIN_BRIDGED_DEPOSIT')
  })
})
