/* eslint-env mocha */

const { assert } = require('chai')

const instance = require('./instance')
const mockGetConf = require('./fixtures/nock/get_conf')

let efx

before(async () => {
  mockGetConf()

  efx = await instance()
})


return

it("efx.contract.locked('ETH') // returns amount of ETH locked", async () => {
  const token = 'ETH'

  const response = await efx.contract.locked(token)

  console.log( 'locked eth ->', efx.web3.utils.fromWei(response) )

  assert.notOk(isNaN(response))
})

it("efx.contract.depositLock('ETH') // returns depositLock value", async () => {
  const token = 'ETH'

  const response = await efx.contract.depositLock(token)

  assert.notOk(isNaN(response))
})

it("efx.contract.isApproved('ZRX') // returns allowance", async () => {
  const token = 'ZRX'

  const response = await efx.contract.isApproved(token)

  assert.notOk(isNaN(response))
})

it("efx.contract.approve('ZRX') // should yield Approval event", async () => {
  const token = 'ZRX'

  const response = await efx.contract.approve(token)

  assert.ok(response.events.Approval)
  // TODO: - validate receipt fields
})

it("efx.contract.lock('ETH', 0.1, duration) // lock 0.0001 ETH", async () => {
  const token = 'ETH'
  const amount = 0.2
  const duration = 1

  // const response = await efx.contract.lock(token, amount, duration)
  const response = await efx.contract.lock(token, amount, duration)

  assert.equal(response.status, true)
})

it("efx.contract.lock('ZRX', 0.0001, duration) // lock 0.0001 ZRX", async () => {
  const token = 'ZRX'
  const amount = 0.0001
  const duration = 250000

  // const response = await efx.contract.lock(token, amount, duration)
  const response = await efx.contract.lock(token, amount, duration)

  assert.ok(response.events.Transfer)

  // TODO: - validate receipt fields
})

it("efx.contract.unlock('ETH', 0.01) // unlock 0.0001 ETH", async () => {
  const token = 'ETH'
  const amount = 0.1

  // const response = await efx.contract.lock(token, amount, duration)
  const response = await efx.contract.unlock(token, amount)

  console.log( 'unlock response ->', response )

  assert.equal(response.status, true)
  // TODO: - validate receipt fields
})

it("efx.contract.unlock('ETH', 100) // fail to unlock 100 ETH", async () => {
  const token = 'ETH'
  const amount = 10000

  try {
    await efx.contract.unlock(token, amount)
  } catch (error) {
    // parity tests yielded this error
    let test = /Transaction ran out of gas/.test(error.message)

    // geth error
    test = test || /gas required exceeds allowance/.test(error.message)

    assert.ok(test)
  }
})
