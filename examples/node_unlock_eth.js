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
