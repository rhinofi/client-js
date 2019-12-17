/* eslint-env mocha */

const instance = require('./helpers/instance')
const { assert } = require('chai')
const nock = require('nock')
const mockGetConf = require('./fixtures/nock/get_conf')
const mockGetUserConf = require('./fixtures/nock/get_user_conf')

// TODO: use nockBack and record fixtures to disk.
// leaving this code here as reference
//
// const nockBack = require('nock').back
// nockBack.setMode('record');
// nockBack.fixtures = __dirname + '/fixtures/nock';

describe('~ efx-api-node', async () => {
  // sometimes nock gets stuck between test:watch
  nock.cleanAll()

  it('efx = await EFX(web3) // create an instance without throwing', async () => {
    // nock.recorder.rec()

    mockGetConf()
    mockGetUserConf()

    const efx = await instance()

    // nock.restore()

    assert.ok(efx.config.tokenRegistry)

    assert.ok(efx.config.tokenRegistry.ETH)
    assert.ok(efx.config.tokenRegistry.ETH.decimals, 18)

    assert.ok(efx.config.tokenRegistry.USD)
    assert.ok(efx.config.tokenRegistry.USD.tokenAddress)
    // assert.ok(result['0x'].tokenRegistry.USDwrapperAddress)
  })

  // TODO: deploy contracts to local granache or testnet in order to test
  // some contract methods
  describe('Deploy contracts to test:rpc', () => {
    // require('./deploy')
  })

  describe('Account', () => {
    // require('./account')
  })

  describe('Signing', () => {
    // require('./signing')
  })

  describe('Blockchain API', () => {
    // comment the line below if you want to skip blockchain tests
    // you need a ropsten node with some ETH / ZRX in order to test
    // those. FIXME: need contracts deployed during test
    // require('./blockchain-api')
  })

  describe('HTTP API', () => {
    try {
      require('./http-api')
    } catch (e) {
      console.log('e ->', e)
    }
  })

  return

  describe('ETH calls', () => {
    require('./eth.js')
  })
})
