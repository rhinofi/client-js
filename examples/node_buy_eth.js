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

  console.log("")

  // submit an order to BUY 0.01 ETH for 1000 USD
  console.log("efx.submitOrder('ETHUSD', 0.01, 1000)")

  response = await efx.submitOrder('ETHUSD', 0.01, 1000)

  if(response.length){
    console.log(` - Submitted Order: #${response[0]}`)
  } else {
    console.log("Error:")
    console.log(response)
  }

}

work()

