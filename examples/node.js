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

  const locked = Number(efx.web3.utils.fromWei(response)).toFixed(8)

  response = await efx.account.balance('ETH')

  const balance = Number(efx.web3.utils.fromWei(response)).toFixed(8)

  console.log( `Your account: ${efx.get('account')}` )
  console.log( ` - balance: ${balance} ETH` )
  console.log( ` -  locked: ${locked} ETH` )

  console.log("")

  console.log("efx.contract.lock('ETH', 0.02, 1)")
  // lock some more
  response = await efx.contract.lock('ETH', 0.02, 1)

  if(response.status){
    console.log( " - OK")
  } else {
    console.log( "Error:")
    console.log(response)
  }

  /**
  console.log("")

  console.log("efx.submitOrder('ETH', -0.01, 1000)")

  // submit an order to sell ETH for 1000 USD
  response = await efx.submitOrder('ETHUSD', -0.01, 1000)

  if(response.length){
    console.log(` - Submitted Order #: ${response[0]}`)
  } else {
    console.log("Error:")
    console.log(response)
  }
  **/

  console.log("")

  console.log("efx.getOrders('ETHUSD')")

  // Cancel all orders
  response = await efx.getOrders('ETHUSD')

  console.log(`Found ${response.length} orders`)

  for(const order of response){
    console.log("")

    console.log(`efx.cancelOrder(${order.id})`)

    try {
      response = await efx.cancelOrder(order.id)
      console.log(" - OK")
    } catch(e) {
      //console.log( 'e ->', e)
      console.log( "error:", e.response.body )
    }
  }

  console.log("")

  console.log("efx.contract.unlock('ETH', 0.01)")

  // unlock some
  response = await efx.contract.unlock('ETH', 0.01, 1000)

  if(response.status){
    console.log( " - OK")
  } else {
    console.log( "Error:")
    console.log(response)
  }

}

work()

