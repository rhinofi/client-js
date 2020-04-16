const { setup } = require('./setup')
const { register } = require('./register')
const { getDepositsWithDVF } = require('./getDeposits')

describe('Integration Test', () => {
  it('just checking', async () => {
    const account = await setup()
    expect(account.INFURA_PROJECT_ID).toEqual(process.env.INFURA_PROJECT_ID)
    expect(account.ETH_PRIVATE_KEY).toEqual(account.account.privateKey)
    expect(account.account.address).not.toBeNull()
    expect(account.account.privateKey).not.toBeNull()

    const dvf = await register(account)
    expect(dvf).not.toBeNull()

    const deposits = await getDepositsWithDVF(dvf)
    expect(deposits.length).toEqual(0)
  })
})
