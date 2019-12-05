
const EFX = require('..')

work = async () => {
  // assuming you have a provider running at:
  // http://localhost:8545
  efx = await EFX()

  // unlock wallet so we can sign transactions
  await efx.account.unlock('password')

  // check how much ETH is already locked
  let response

  // lock some ETH

  //console.log("efx.contract.lock('ETH', 0.02, 10)")
  //response = await efx.contract.lock('ETH', 0.02, 10)
  //response = await efx.contract.approve('USD')
  response = await efx.contract.lock('ETH', 0.05, 10)

  if(response.status){
    console.log( " - OK")
  } else {
    console.log( "Error:")
    console.log(response)
  }

  // lock some USD

  /**
  console.log("efx.contract.lock('USD', 100, 10)")
  response = await efx.contract.lock('USD', 100, 100)

  if(response.status){
    console.log( " - OK")
  } else {
    console.log( "Error:")
    console.log(response)
  }**/

}

work()

