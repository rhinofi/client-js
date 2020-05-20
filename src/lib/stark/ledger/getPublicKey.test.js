const instance = require('../../../api/test/helpers/instance')
const mockGetConf = require('../../../api/test/fixtures/getConf')

jest.mock('../../ledger/selectTransport')
const mockSelector = require('../../ledger/selectTransport')

const {
  createTransportReplayer,
  RecordStore
} = require('@ledgerhq/hw-transport-mocker')

const Transport = createTransportReplayer(
  RecordStore.fromString(`
  => e002000015058000002c8000003c800000008000000000000000
  <= 41043f1c41b1a135df85fe04d2eb22fe942d42191c45154ac03086835ea59efe5c5c425c3f01984de6c3ff2cb6bb0a7b5489c484ec04598b8b2d694b12e984a55a0d28376439324632643736636439334441333930363666394236393561646333336534646330386135349000
  => f0020000190680000a55a2862ad3d30829b6cdc08a54ab5b867c00000000
  <= 0401841559c5a886771644573dbb6dba210a1a7a0834afcf6bb3cbba1565ae7b3202f0f543d1b6666fa1e093b5d03feb90f0e68ab007baf587b6285d425d8a34dc9000

  `)
)

let dvf

describe('dvf.stark.ledger.getPublicKey', () => {
  beforeAll(async () => {
    mockGetConf()
    dvf = await instance()
  })

  it('gets stark public key from ledger', async () => {
    const path = `44'/60'/0'/0'/0`

    mockSelector.mockImplementation(() => { return Transport })

    const starkPublicKey = await dvf.stark.ledger.getPublicKey(path)

    expect(starkPublicKey.x).toMatch(/[\da-f]/i)
    expect(starkPublicKey.y).toMatch(/[\da-f]/i)
  })
})
