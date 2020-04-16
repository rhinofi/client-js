const instance = require('../../../api/test/helpers/instance')

const mockGetConf = require('../../../api/test/fixtures/getConf')
let dvf

describe('dvf.stark.ledger.getPublicKey', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('gets stark public key from ledger', async () => {
    const path = `44'/60'/0'/0'/0`
    const starkPublicKey = await dvf.stark.ledger.getPublicKey(path)
    console.log({starkPublicKey})
    expect(starkPublicKey.x).toMatch(/[\da-f]/i)
    expect(starkPublicKey.y).toMatch(/[\da-f]/i)
  })
})
