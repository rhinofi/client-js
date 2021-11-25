const nock = require('nock')
const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.getRegistrationStatuses', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    return nock.cleanAll()
  })

  it(`Queries for registration statuses`, async () => {
    const apiResponse = {
      isRegisteredOnDeversifi: true,
      isRegisteredOnChain: true
    }

    const queryValidator = jest.fn(async () => true)

    nock(dvf.config.api)
      .get(/\/v1\/trading\/registrations/)
      .query(queryValidator)
      .reply(200, apiResponse)

    const response = await dvf.getRegistrationStatuses({
      targetEthAddress: '0x08152c1265dbc218ccc8ab5c574e6bd52279b3b7'
    })
    expect(queryValidator).toBeCalled()
    expect(response).toMatchObject(apiResponse)
  })

  it(`Triggers error when targetEthAddress is incorrect`, async () => {
    await expect(
      dvf.getRegistrationStatuses({
        targetEthAddress: '08152c1265dbc218ccc8ab5c574e6bd52279b3b7'
      })
    ).rejects.toThrow('INVALID_METHOD_ARGUMENT')
  })

  it(`Triggers error when targetEthAddress is missing`, async () => {
    await expect(dvf.getRegistrationStatuses({}))
      .rejects.toThrow('INVALID_METHOD_ARGUMENT')
  })

  it(`Triggers error when called without argument`, async () => {
    await expect(dvf.getRegistrationStatuses())
      .rejects.toThrow('INVALID_METHOD_ARGUMENT')
  })
})
