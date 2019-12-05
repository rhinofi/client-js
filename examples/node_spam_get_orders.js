// Please check ../test/index.js for all examples and tests

const EFX = require('..')

const _ = require('lodash')

let addresses = []

getOrders = async (efx, account) => {

  console.log("Getting order for account: ", account)

  let response

  try {
    await efx.account.select(account)

    response = await efx.getOrders()
  } catch(e){
    console.log( "failed to get orders", e.message)
  }

  if(!response || response.error){
    console.log(`Error getting orders for ${account}`)
    console.log(response.error)
    console.log()
  }

  setTimeout(() => {getOrders(efx,account), 500})
}

work = async () => {
  // assuming you have a provider running at:
  // http://localhost:8545
  const efx = await EFX()

  const accounts = await efx.web3.eth.getAccounts()

  console.log( `using ${accounts.length} accounts` )

  // unlock all accounts and triggering getOrders
  let account
  for( let index in accounts ) {
    account = accounts[index]

    await efx.account.select(account)

    await efx.account.unlock('password')

    setTimeout(() => getOrders(efx, accounts[index]), 100 * index)
  }

}

work()


