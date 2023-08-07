const nock = require('nock')
const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')

describe('dvf.storeStarkL1Registration', () => {
  const tradingKey = process.env.PRIVATE_STARK_KEY
  const config = {
    wallet: {
      type: 'tradingKey',
      meta: {
        starkPrivateKey: tradingKey
      }
    }
  }
  /**
   * @param {(dvf: Awaited<ReturnType<typeof instance>) => Promise<unknown>} fn 
   */
  const withInstance = (fn) => async () => fn(await instance(config))

  beforeAll(async () => {
    mockGetConf()
  })

  afterAll(() => {
    nock.restore()
  })

  it('Generates and submits the registration payload', withInstance(async (dvf) => {
    mockGetConf()

    const expectedBody = {
      l1RegistrationSignature: '0x025e160f8936b367f1aa10f4602dd54a31831de28cfc4263cbfd6b2fd3e9328602421b80ed0520b9e4d20620339ecd34093f04cec933bdebddc31e3bfcd32e5504de195d61296b6ac602ab5db8d190b90cd1e767fe9d47d4c9d96ab62cf7ad41'
    }

    const payloadValidator = jest.fn(body => {
      expect(body).toMatchObject(expectedBody)
      return true
    })

    nock(dvf.config.api)
      .post('/v1/trading/storeStarkL1Registration', payloadValidator)
      .reply(200)

    await dvf.storeStarkL1Registration(tradingKey)
    expect(payloadValidator).toBeCalled()
  }))
})
