/* eslint-env mocha */

const { assert } = require('chai')
const instance = require('./helpers/instance')
const mockGetConf = require('./fixtures/nock/get_conf')

let efx

before(async () => {
  mockGetConf()
  efx = await instance()
})

it('efx.eth.getNetwork()', async () => {
  const network = await efx.eth.getNetwork()

  assert.ok(network.id)
  assert.ok(network.name)

  console.log(`Network: ${network.name} id: ${network.id}`)
})

it('efx.web3.eth.getBlockNumber()', async () => {
  const block = await efx.web3.eth.getBlockNumber()

  console.log('Current block: ', block)
})
