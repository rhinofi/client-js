const nock = require('nock')
const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.getVaultIdAndStarkKey', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it(`Queries for vaultId and stark key given ETH address and token`, async () => {
    const targetEthAddress = '0x08152c1265dbc218ccc8ab5c574e6bd52279b3b7'
    const token = 'ETH'

    const apiResponse = {
      starkKey: '0x0180fc633b754b50370614a587218cf36a4fa7c2f11d65ec761dded48a81ab9e',
      vaultId: 1644016910
    }

    const queryValidator = jest.fn(query => {
      expect(query).toMatchObject({
        targetEthAddress,
        token
      })
      return true
    })

    nock(dvf.config.api)
      .get(/\/v1\/trading\/r\/vaultIdAndStarkKey/)
      .query(queryValidator)
      .reply(200, apiResponse)

    const response = await dvf.getVaultIdAndStarkKey({targetEthAddress, token})
    expect(queryValidator).toBeCalled()
    expect(response).toMatchObject(apiResponse)
  })

  it(`Throws error returned by the server`, async () => {
    const targetEthAddress = '0x08152c1265dbc218ccc8ab5c574e6bd52279b3b7'
    const token = 'ETH'

    nock(dvf.config.api)
      .get(/\/v1\/trading\/r\/vaultIdAndStarkKey/)
      .reply(404, {statusCode: 404, message: 'Target user is not registered'})

    await expect(dvf.getVaultIdAndStarkKey({targetEthAddress, token}))
      .rejects
      .toThrow(/404/)
  })
})
