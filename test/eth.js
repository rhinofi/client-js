/* eslint-env mocha */

const { assert } = require('chai')
const instance = require('./helpers/instance')
const mockGetConf = require('./fixtures/nock/get_conf')

let dvf

before(async () => {
  mockGetConf()
  dvf = await instance()
})

it('dvf.eth.getNetwork()', async () => {
  const network = await dvf.eth.getNetwork()

  assert.ok(network.id)
  assert.ok(network.name)

  console.log(`Network: ${network.name} id: ${network.id}`)
})

it('dvf.web3.eth.getBlockNumber()', async () => {
  const block = await dvf.web3.eth.getBlockNumber()

  console.log('Current block: ', block)
})
