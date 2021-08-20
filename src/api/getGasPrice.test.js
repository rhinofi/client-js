const nock = require('nock')
const instance = require('./test/helpers/instance')

const mockGetConf = require('./test/fixtures/getConf')
const mockGasPrice = require('./test/fixtures/mockGasPrice')

let dvf

describe('dvf.getGasPrice', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it('Returns gas price range', async () => {
    const apiResponse = {
      cheap: 700000000,
      average: 600000000,
      fast: 500000000
    }
    mockGasPrice()
    const response = await dvf.getGasPrice()

    expect(response).toMatchObject(apiResponse)
  })
})
