const nock = require('nock')
const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')

let dvf
let ethSendMock
// Stubs the 'send' function for blockchain transactions and returns
// choosen status and tx hash
const stubDvfEthSend = (dvfEth, {stubTxHash, status = true}) => {
  ethSendMock = jest.spyOn(dvfEth, 'send')
    .mockImplementation(async (abi, address, action, args, value, options) => {
      options.transactionHashCb(stubTxHash)
      return {status}
    })
  return ethSendMock
}

describe('dvf.depositV2', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  afterEach(() => {
    ethSendMock.mockReset()
  })

  afterAll(() => {
    ethSendMock.mockRestore()
  })

  it(`Deposits ERC20 token to user's vault`, async () => {
    const amount = '1394.0000051'
    const token = 'USDT'

    const stubTxHash = '0x123456'
    const stubSendFn = stubDvfEthSend(dvf.eth, {stubTxHash})

    const expectedPayload = {
      token,
      // Amount for USDT is quantised to 6 decimals, rounded down
      amount: '1394000005',
      txHash: stubTxHash
    }

    const apiResponse = {
      ...expectedPayload,
      pending: true,
      expiresAt: (new Date()).toString(),
      tx: {
        vaultId: 1234,
        tokenId: 5678,
        starkKey: '0x',
        amount: '1394000005'
      }
    }

    const payloadValidator = jest.fn((body) => {
      expect(body).toMatchObject(expectedPayload)
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/deposits', payloadValidator)
      .reply(200, apiResponse)

    await dvf.depositV2({ token, amount })

    expect(payloadValidator).toBeCalled()
    expect(stubSendFn.mock.calls.length).toBe(1)
  })

  it('Deposits ETH to users vault', async () => {
    mockGetConf()
    const token = 'ETH'
    const amount = '1.1177777777'

    const stubTxHash = '0x123456'
    const stubSendFn = stubDvfEthSend(dvf.eth, {stubTxHash})

    const expectedPayload = {
      token,
      // Amount for ETH is quantised to 8 decimals, rounded down
      amount: '111777777',
      txHash: stubTxHash
    }

    const apiResponse = {
      ...expectedPayload,
      pending: true,
      expiresAt: (new Date()).toString(),
      tx: {
        vaultId: 1234,
        tokenId: 5678,
        starkKey: '0x',
        amount: '1394000005'
      }
    }

    const payloadValidator = jest.fn((body) => {
      expect(body).toMatchObject(expectedPayload)
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/deposits', payloadValidator)
      .reply(200, apiResponse)

    await dvf.depositV2({ token, amount })

    expect(payloadValidator).toBeCalled()
    expect(stubSendFn.mock.calls.length).toBe(1)
  })

  it('Gives error for deposit with no amount', async () => {
    const token = 'ZRX'

    expect(dvf.depositV2({ token })).rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error for deposit with value of 0', async () => {
    const amount = '0'
    const token = 'ZRX'

    expect(dvf.depositV2({ token, amount })).rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error if token is empty', async () => {
    const amount = '57'
    const token = ''

    expect(dvf.depositV2({ token, amount })).rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error for deposit with no token', async () => {
    const amount = '57'

    expect(dvf.depositV2({ amount })).rejects
      .toThrow('ERR_INVALID_TOKEN')
  })

  it('Gives error if token is not supported', async () => {
    const amount = '57'
    const token = 'NOT'

    expect(dvf.depositV2({ token, amount })).rejects
      .toThrow('INVALID_TOKEN')
  })

  it('Posts to deposit API and gets error response', async () => {
    stubDvfEthSend(dvf.eth, '0x123456')

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
      .post('/v1/trading/deposits')
      .reply(422, apiErrorResponse)

    expect(dvf.depositV2({ token: 'ZRX', amount: 31 })).rejects
      .toThrow({error: apiErrorResponse})
  })

  it('Handles bloclchain transaction error', async () => {
    const stubTxHash = '0x123456'
    stubDvfEthSend(dvf.eth, {stubTxHash, status: false})

    const apiResponse = {
      token: 'ZRX',
      // Amount for USDT is quantised to 6 decimals, rounded down
      amount: '1394000005',
      txHash: stubTxHash,
      pending: true,
      expiresAt: (new Date()).toString(),
      tx: {
        vaultId: 1234,
        tokenId: 5678,
        starkKey: '0x',
        amount: '1394000005'
      }
    }
    nock(dvf.config.api)
      .post('/v1/trading/deposits')
      .reply(422, apiResponse)

    expect(dvf.depositV2({ token: 'ZRX', amount: 31 })).rejects
      .toThrow('ERR_ONCHAIN_DEPOSIT')
  })
})
