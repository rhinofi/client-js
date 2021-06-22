const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

let dvf

const nockUrl = '/v1/trading/bridgedWithdrawals'

const exchangeMockStarkKey = '0x0180fc633b754b50370614a587218cf36a4fa7c2f11d65ec761dded48a81ab9e'
const exchangeMockVaultId = 1644016910

const nockExchangeVaultIdAndStarkKeyForToken = token => {
  const vaultIdAndStarkKeyApiResponse = {
    starkKey: exchangeMockStarkKey,
    vaultId: exchangeMockVaultId
  }

  const vaultIdAndStarkKeyQueryValidator = jest.fn(query => {
    expect(query).toMatchObject({
      targetEthAddress: dvf.config.DVF.deversifiAddress,
      token
    })
    return true
  })

  nock(dvf.config.api)
    .get(/\/v1\/trading\/r\/vaultIdAndStarkKey/)
    .query(vaultIdAndStarkKeyQueryValidator)
    .reply(200, vaultIdAndStarkKeyApiResponse)
}

describe('dvf.bridgedWithdraw', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
    dvf.util.attachStarkProvider({
      type: 'tradingKey',
      meta: {
        starkPrivateKey: '11111'
      }
    })
  })

  it(`Withdraws ERC20 token to user's vault`, async () => {
    const chain = 'MATIC_POS'
    const amount = 1394.0000051
    const token = 'USDT'

    const expectedPayload = {
      chain,
      amount: '1394000005',
      token,
      tx: {
        receiverVaultId: exchangeMockVaultId,
        receiverPublicKey: exchangeMockStarkKey,
        amount: '1394000005'
      }
    }

    const mockedApiResponse = {
      ...expectedPayload,
      chain,
      readyToWithdrawOnChain: false
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(expectedPayload)
      expect(typeof body.nonce).toBe('number')
      return true
    })

    nockExchangeVaultIdAndStarkKeyForToken(token)

    nock(dvf.config.api)
      .post(nockUrl, payloadValidator)
      .reply(200, mockedApiResponse)

    await dvf.bridgedWithdraw({ chain, token, amount })

    expect(payloadValidator).toBeCalled()
  })

  it('Withdraws ETH to users vault', async () => {
    const chain = 'MATIC_POS'
    const amount = 1.1177777777
    const token = 'ETH'

    const expectedPayload = {
      // Amount for ETH is quantised to 8 decimals, rounded HALF-UP
      amount: '111777778',
      token,
      tx: {
        receiverVaultId: exchangeMockVaultId,
        receiverPublicKey: exchangeMockStarkKey,
        amount: '111777778'
      }
    }

    const mockedApiResponse = {
      ...expectedPayload,
      chain,
      readyToWithdrawOnChain: false
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(expectedPayload)
      expect(typeof body.nonce).toBe('number')
      return true
    })

    nockExchangeVaultIdAndStarkKeyForToken('ETH')

    nock(dvf.config.api)
      .post(nockUrl, payloadValidator)
      .reply(200, mockedApiResponse)

    await dvf.bridgedWithdraw({ chain, token, amount })

    expect(payloadValidator).toBeCalled()
  })

  it('Withdraws ETH to users vault taking input nonce', async () => {
    const chain = 'MATIC_POS'
    const token = 'ETH'
    const amount = '1.117'
    const nonce = 1559

    const expectedPayload = {
      amount: '111700000',
      token,
      nonce,
      tx: {
        receiverVaultId: exchangeMockVaultId,
        receiverPublicKey: exchangeMockStarkKey,
        amount: '111700000'
      }
    }

    const mockedApiResponse = {
      ...expectedPayload,
      chain,
      readyToWithdrawOnChain: false
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(expectedPayload)
      return true
    })

    nockExchangeVaultIdAndStarkKeyForToken('ETH')

    nock(dvf.config.api)
      .post(nockUrl, payloadValidator)
      .reply(200, mockedApiResponse)

    await dvf.bridgedWithdraw({ chain, token, amount, nonce })

    expect(payloadValidator).toBeCalled()
  })

  it('Gives error for withdrawal with no chain argument', async () => {
    const amount = 10
    const token = 'USDT'

    await expect(dvf.bridgedWithdraw({ token, amount }))
      .rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error for unsupported token for chain', async () => {
    const chain = 'MATIC_POS'
    const amount = 10
    const token = 'ZRX'
    await expect(dvf.bridgedWithdraw({ chain, token, amount }))
      .rejects
      .toThrow('UNSUPPORTED_TOKEN_FOR_CHAIN')
  })

  it('Gives error for withdrawal with value of 0', async () => {
    const chain = 'MATIC_POS'
    const amount = 0
    const token = 'USDT'

    await expect(dvf.bridgedWithdraw({ chain, token, amount }))
      .rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error if token is missing', async () => {
    const chain = 'MATIC_POS'
    const amount = 57
    const token = ''

    await expect(dvf.bridgedWithdraw({ chain, token, amount }))
      .rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error if token is not supported', async () => {
    const chain = 'MATIC_POS'
    const amount = 57
    const token = 'NOT'

    await expect(dvf.bridgedWithdraw({ chain, token, amount }))
      .rejects
      .toThrow('ERR_INVALID_TOKEN')
  })

  it('Posts to withdrawal API and gets error response', async () => {
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

    nockExchangeVaultIdAndStarkKeyForToken(token)

    nock(dvf.config.api)
      .post(nockUrl)
      .reply(422, apiErrorResponse)

    await expect(dvf.bridgedWithdraw({ chain, token, amount }))
      .rejects
      .toThrow(apiErrorResponse.message)
  })
})
