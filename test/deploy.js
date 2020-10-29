/* eslint-env mocha */

const {assert} = require('chai')

const deploy = require('./contracts/deploy')
const deployed = require('./contracts/deployed')

it('Deploy WETH9_ contract', async () => {
  // you need to run the following command in order to generate this json:
  // npm run test:contracts:compile
  const json = require('./contracts/WrapperLockEth.sol')

  await deploy(json, 'WrapperLockEth')

  assert.ok(deployed.WETH9_)
  assert.ok(deployed.WETH9_.methods)
  assert.ok(deployed.WETH9_.options.address)
})

it('Deploy WUSD9_ contract', async () => {
  // you need to run the following command in order to generate this json:
  // npm run test:contracts:compile
  const json = require('./contracts/WrapperLockUsd.sol')

  await deploy(json, 'WUSD9_')

  assert.ok(deployed.WETH9_)
  assert.ok(deployed.WETH9_.methods)
  assert.ok(deployed.WETH9_.options.address)
})

it('Deploy ZRXToken contract', async () => {
  // you need to run the following command in order to generate this json:
  // npm run test:contracts:compile
  const json = require('./contracts/ZRXToken.sol.json')

  await deploy(json, 'ZRXToken')

  assert.ok(deployed.WETH9_)
  assert.ok(deployed.WETH9_.methods)
  assert.ok(deployed.WETH9_.options.address)
})
