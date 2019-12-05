/* eslint-env mocha */
const instance = require('./helpers/instance')
const { assert } = require('chai')
const mockGetConf = require('./fixtures/nock/get_conf')

let efx

before(async () => {
  mockGetConf()
  efx = await instance()
})

it('efx.account.select(0) // first account is selected by default', () => {
  // you can select account using an address or an account index
  // it will return null if address isnt found on the list of accounts
  efx.account.select('0x97EBb3391B30F495CE8cB97857dB9B72D3e9DbCB')

  // you can also select it using an account index
  efx.account.select(0)

  // you can fetch and subscribe to an account at the same time:
  efx.on('account', (account) => {
    console.log('Your current account:', account)
  })

  // or simply fetch it
  const selectedAccount = efx.get('account')
})

it('await efx.account.balance() // return ETH balance', async () => {
  const response = await efx.account.balance()

  assert.notOk(isNaN(response))

  console.log( 'eth balance ->', efx.web3.utils.fromWei(response) )
})

it("await efx.account.tokenBalance('USD') // return USD balance", async () => {
  const token = 'USD'

  const response = await efx.account.tokenBalance(token)

  assert.notOk(isNaN(response))
})