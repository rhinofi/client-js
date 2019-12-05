// Please check ../test/index.js for all examples and tests

const EFX = require('..')

work = async () => {
  // assuming you have a provider running at:
  // http://localhost:8545
  efx = await EFX()

  // unlock wallet so we can sign transactions
  await efx.account.unlock('password')

  // check how much ETH is already locked
  let response

  response = await efx.contract.locked('ETH')

  console.log("")

  console.log("efx.getOrders()")

  // Cancel all orders
  response = await efx.getOrders()

  console.log(`Found ${response.length} orders`)

  for(const order of response){
    console.log("")

    console.log( "cancel order #", order.id )

    try {
      response = await efx.cancelOrder(order.id)
      console.log(" - OK")
    } catch(e) {
      //console.log( 'e ->', e)
      console.log( "error:", e.response.body )
    }
  }

}

work()

