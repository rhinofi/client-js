// Please check ../test/index.js for all examples and tests

const EFX = require('..')

const _ = require('lodash')
const P = require('bluebird')

let addresses = []

submitBuyOrder = async (efx, account, price) => {
  await efx.account.select(account)

  await efx.account.unlock('password')

  const amount = 25 / price

  response = await efx.submitOrder('ETHUSD', amount, price)

  console.log( `Submited buy ${amount} ETH for ${price} on behalf of ${account}`)

  if(response.error){
    console.log( " - error", response.error)
  } else {
    console.log( " - OK", response)
  }
}

submitSellOrder = async (efx, account, price) => {
  await efx.account.select(account)

  await efx.account.unlock('password')

  const amount = 25 / price

  response = await efx.submitOrder('ETHUSD', -amount, price)

  console.log( `Submited sell -${amount} ETH for ${price} on behalf of ${account}`)

  if(response.error){
    console.log( " - error", response.error)
  } else {
    console.log( " - OK", response)
  }
}

cancelAllOrders = async(efx, account) => {

  await efx.account.select(account)

  await efx.account.unlock('password')

  // Cancel all orders
  response = await efx.getOrders()

  console.log(`Found ${response.length} orders from ${account}`)

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

work = async () => {
  // assuming you have a provider running at:
  // http://localhost:8545
  const efx = await EFX()

  const accounts = await efx.web3.eth.getAccounts()

  let indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  indexes = _.shuffle(indexes)

  const INITIAL_PRICE = 200 + Math.random() * 100 - 50

  const randomOffset = () => Math.random() * 10 - 5

  const sellOrders = Promise.all([
    // send 5 orders in parallel
     submitSellOrder(efx, accounts[indexes[0]], INITIAL_PRICE + 0 + randomOffset() ),
     submitSellOrder(efx, accounts[indexes[1]], INITIAL_PRICE + 1 + randomOffset() ),
     submitSellOrder(efx, accounts[indexes[2]], INITIAL_PRICE + 2 + randomOffset() ),
     submitSellOrder(efx, accounts[indexes[3]], INITIAL_PRICE + 3 + randomOffset() ),
     submitSellOrder(efx, accounts[indexes[4]], INITIAL_PRICE + 4 + randomOffset() )
  ])

  //console.log( "-------------" )
  //console.log( "sent all sells" )
  //console.log( "" )

  const buyOrders = Promise.all([
    // send 5 orders in parallel
     submitBuyOrder(efx, accounts[indexes[5]], INITIAL_PRICE - 4 + randomOffset() ),
     submitBuyOrder(efx, accounts[indexes[6]], INITIAL_PRICE - 3 + randomOffset() ),
     submitBuyOrder(efx, accounts[indexes[7]], INITIAL_PRICE - 2 + randomOffset() ),
     submitBuyOrder(efx, accounts[indexes[8]], INITIAL_PRICE - 1 + randomOffset() ),
     submitBuyOrder(efx, accounts[indexes[9]], INITIAL_PRICE - 0 + randomOffset() )
  ])

  //console.log( "-------------" )
  //console.log( "cancelled all sells" )
  //console.log( "" )

  console.log("Firing 10 orders")
  console.log('--------- --------- --------')
  console.log('')

  await P.all([sellOrders, buyOrders])

  console.log('')
  console.log('--------- --------- --------')
  console.log('')

  console.log("Cancelling all orders")
  console.log('--------- --------- --------')
  console.log('')

  let cancelOrders = []

  for(let account of accounts){

    // pseudo-randomly keep some orders in
    if(Math.random() < 0.5){ continue }

    //cancelOrders.push(await cancelAllOrders(efx, account))
  }

  await P.all(cancelOrders)

  console.log('--------- --------- --------')
  console.log('')

  console.log(' -- OK')

  setTimeout(work, 500)

}

work()


