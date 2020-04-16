const instance = require('../../../api/test/helpers/instance')

let dvf

describe('dvf.deposit', () => {
  beforeAll(async () => {
    dvf = await instance()
  })

  it('gets stark public key from ledger', async () => {
    const path = `21323'/0`
    const starkPublicKey = await dvf.stark.ledger.getPublicKey(path)
    expect(starkPublicKey.x).toMatch(/[\da-f]/i)
    expect(starkPublicKey.y).toMatch(/[\da-f]/i)
  })
})
