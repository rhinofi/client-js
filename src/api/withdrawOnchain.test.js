const instance = require('./test/helpers/instance')
const mockGasPrice = require('./test/fixtures/getSafeGasPrice')
const mockGetConf = require('./test/fixtures/getConf')

let dvf

describe('dvf.withdrawOnchain', () => {
  beforeAll(async () => {
    mockGetConf()
    mockGasPrice()
    dvf = await instance()
  })

  it(`Withdraw ETH or ERC20 from onchain call to stark ex`, async () => {
    const token = 'ETH'

    const response = await dvf.withdrawOnchain(token)
    console.log(response)
    expect(response.transactionHash).toMatch(/[\da-f]/i)
  })
})
