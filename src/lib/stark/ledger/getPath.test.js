const instance = require('../../../api/test/helpers/instance')

let dvf

describe('dvf.stark.ledger.getPath', () => {
  beforeAll(async () => {
    
    dvf = await instance()
  })

  it('gets stark path for ledger', async () => {
    const address = '0x7d92F2d76cd93DA39066f9B695adc33e4dc08a54'
    const derivedStarkPath = `21323'/2645'/579218131'/1393043894'/2106782423'/913088209'/0`

    const starkPath = await dvf.stark.ledger.getPath(address)

    console.log({starkPath})
    expect(starkPath).toMatch(derivedStarkPath)

  })
})
