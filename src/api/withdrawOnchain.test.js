const nock = require('nock')
const instance = require('./test/helpers/instance')
const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe.skip('dvf.withdrawOnchain', () => {
  beforeAll(async () => {
    nock.cleanAll()
    mockGetConf()
    dvf = await instance()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it(`Withdraw ETH or ERC20 from onchain call to stark ex`, async () => {
    mockGetConf()
    const token = 'ETH'

    const response = await dvf.withdrawOnchain(token)
    expect(response.transactionHash).toMatch(/[\da-f]/i)
  })
})
