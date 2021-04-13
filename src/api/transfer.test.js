const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')

const sw = require('starkware_crypto')
const toQuantizedAmount = require('../lib/dvf/token/toQuantizedAmount')
const createKeyPair = require('../lib/stark/createKeyPair')

// Mocks the first call to the server used to lookup recipient vaultId and stark key
const mockVaultIdAndStarkKeyApiCall = ({ targetEthAddress, token }) => {
  const vaultIdAndStarkKeyApiResponse = {
    vaultId: 1559,
    // For ETH address : 0x5317c63f870e8d2f85f0de3c2666d1414f5a728c
    starkKey: '0x00334070e2218dac427f3a9cbcc057cb07e8fb161a70bd4f4b83e6cf3ed02529'
  }

  const vaultIdAndStarkKeyQueryValidator = jest.fn(query => {
    expect(query).toMatchObject({
      targetEthAddress,
      token
    })
    return true
  })

  nock(dvf.config.api)
    .get(/\/v1\/trading\/r\/vaultIdAndStarkKey.*/)
    .query(vaultIdAndStarkKeyQueryValidator)
    .reply(200, vaultIdAndStarkKeyApiResponse)

  return [vaultIdAndStarkKeyQueryValidator, vaultIdAndStarkKeyApiResponse]
}

let dvf

describe('dvf.transfer', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it(`Transfers ERC20 token to user's vault`, async () => {
    const starkPrivateKey = '100'
    const senderKeyPair = createKeyPair({ sw }, starkPrivateKey)

    const recipientEthAddress = '0x5317c63f870e8d2f85f0de3c2666d1414f5a728c'
    const amount = 12
    const token = 'USDT'

    const [
      vaultIdAndStarkKeyQueryValidator,
      vaultIdAndStarkKeyApiResponse
    ] = mockVaultIdAndStarkKeyApiCall({ targetEthAddress: recipientEthAddress, token })

    const transferApiResponse = {
      _id: 'LCafcGC6tBH',
      token,
      amount: toQuantizedAmount(dvf, token, amount),
      recipient: recipientEthAddress,
      createAt: (new Date()).toISOString()
    }

    const transferPayloadValidator = jest.fn(body => {
      expect(body.tx.signature.s).toMatch(/[\da-f]/i)
      expect(body).toMatchObject({
        tx: {
          type: 'TransferRequest',
          amount: toQuantizedAmount(dvf, token, amount),
          receiverVaultId: vaultIdAndStarkKeyApiResponse.vaultId,
          receiverPublicKey: vaultIdAndStarkKeyApiResponse.starkKey,
          senderPublicKey: '0x' + senderKeyPair.starkPublicKey.x
        },
        starkPublicKey: senderKeyPair.starkPublicKey
      })
      expect(body.tx.token).toMatch(/0x[\da-f]+/i)
      expect(body.tx.signature.r).toMatch(/[\da-f]/i)
      expect(body.tx.signature.s).toMatch(/[\da-f]/i)
      expect(typeof body.tx.nonce).toBe('number')
      expect(typeof body.tx.expirationTimestamp).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/transfer', transferPayloadValidator)
      .reply(200, transferApiResponse)

    await dvf.transfer({ recipientEthAddress, token, amount }, starkPrivateKey)

    expect(vaultIdAndStarkKeyQueryValidator).toBeCalled()
    expect(transferPayloadValidator).toBeCalled()
  })

  it(`Transfers ETH token to user's vault`, async () => {
    const starkPrivateKey = '100'
    const senderKeyPair = createKeyPair({ sw }, starkPrivateKey)

    const recipientEthAddress = '0x5317c63f870e8d2f85f0de3c2666d1414f5a728c'
    const amount = 12
    const token = 'ETH'

    const [
      vaultIdAndStarkKeyQueryValidator,
      vaultIdAndStarkKeyApiResponse
    ] = mockVaultIdAndStarkKeyApiCall({ targetEthAddress: recipientEthAddress, token })

    const transferApiResponse = {
      _id: 'LCafcGC6tBH',
      token,
      amount: toQuantizedAmount(dvf, token, amount),
      recipient: recipientEthAddress,
      createAt: (new Date()).toISOString()
    }

    const transferPayloadValidator = jest.fn(body => {
      expect(body.tx.signature.s).toMatch(/[\da-f]/i)
      expect(body).toMatchObject({
        tx: {
          type: 'TransferRequest',
          amount: toQuantizedAmount(dvf, token, amount),
          receiverVaultId: vaultIdAndStarkKeyApiResponse.vaultId,
          receiverPublicKey: vaultIdAndStarkKeyApiResponse.starkKey,
          senderPublicKey: '0x' + senderKeyPair.starkPublicKey.x
        },
        starkPublicKey: senderKeyPair.starkPublicKey
      })
      expect(body.tx.token).toMatch(/0x[\da-f]+/i)
      expect(body.tx.signature.r).toMatch(/[\da-f]/i)
      expect(body.tx.signature.s).toMatch(/[\da-f]/i)
      expect(typeof body.tx.nonce).toBe('number')
      expect(typeof body.tx.expirationTimestamp).toBe('number')
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/transfer', transferPayloadValidator)
      .reply(200, transferApiResponse)

    await dvf.transfer({ recipientEthAddress, token, amount }, starkPrivateKey)

    expect(vaultIdAndStarkKeyQueryValidator).toBeCalled()
    expect(transferPayloadValidator).toBeCalled()
  })

  it(`Should throw if vaultIdAndStarkKey request returns an error`, async () => {
    const starkPrivateKey = '100'

    const recipientEthAddress = '0x5317c63f870e8d2f85f0de3c2666d1414f5a728c'
    const amount = 12
    const token = 'USDT'

    const vaultIdAndStarkKeyQueryValidator = jest.fn(query => {
      return true
    })

    nock(dvf.config.api)
      .get(/\/v1\/trading\/r\/vaultIdAndStarkKey.*/)
      .query(vaultIdAndStarkKeyQueryValidator)
      .reply(404, { message: 'Target user not registered' })

    const transferPayloadValidator = jest.fn(body => {
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/w/transfer', transferPayloadValidator)
      .reply(200)

    await expect(dvf.transfer({ recipientEthAddress, token, amount }, starkPrivateKey))
      .rejects
      .toThrow(/Target user not registered/)

    expect(vaultIdAndStarkKeyQueryValidator).toBeCalled()
    expect(transferPayloadValidator).not.toBeCalled()
  })

  it('Gives error for transfer with value of 0', async () => {
    const starkPrivateKey = '100'

    const recipientEthAddress = '0x5317c63f870e8d2f85f0de3c2666d1414f5a728c'
    const amount = 0
    const token = 'ZRX'

    await expect(dvf.transfer({ token, amount, recipientEthAddress }, starkPrivateKey))
      .rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error if token is missing', async () => {
    const starkPrivateKey = '100'

    const recipientEthAddress = '0x5317c63f870e8d2f85f0de3c2666d1414f5a728c'
    const amount = 14
    const token = ''

    await expect(dvf.transfer({ token, amount, recipientEthAddress }, starkPrivateKey))
      .rejects
      .toThrow('INVALID_METHOD_ARGUMENT')
  })

  it('Gives error if token is not supported', async () => {
    const starkPrivateKey = '100'

    const recipientEthAddress = '0x5317c63f870e8d2f85f0de3c2666d1414f5a728c'
    const amount = 14
    const token = 'NOT'

    mockVaultIdAndStarkKeyApiCall({ targetEthAddress: recipientEthAddress, token })

    await expect(dvf.transfer({ token, amount, recipientEthAddress }, starkPrivateKey))
      .rejects
      .toThrow('ERR_INVALID_TOKEN')
  })

  it('Gives error if starkPrivateKey is not provided', async () => {
    const starkPrivateKey = ''

    const recipientEthAddress = '0x5317c63f870e8d2f85f0de3c2666d1414f5a728c'
    const amount = 14
    const token = 'ZRX'

    mockVaultIdAndStarkKeyApiCall({ targetEthAddress: recipientEthAddress, token })

    await expect(dvf.transfer({ token, amount, recipientEthAddress }, starkPrivateKey))
      .rejects
      .toThrow('STARK_PRIVATE_KEY_IS_REQUIRED')
  })

  it('Posts to transfer API and gets error response', async () => {
    const starkPrivateKey = '100'

    const recipientEthAddress = '0x5317c63f870e8d2f85f0de3c2666d1414f5a728c'
    const amount = 14
    const token = 'ZRX'

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

    mockVaultIdAndStarkKeyApiCall({ targetEthAddress: recipientEthAddress, token })

    nock(dvf.config.api)
      .post('/v1/trading/w/transfer')
      .reply(422, apiErrorResponse)

    await expect(dvf.transfer({ recipientEthAddress, amount, token }, starkPrivateKey))
      .rejects
      .toThrow(/MUST_REGISTER/)
  })
})
