// Please check ../test/index.js for all examples and tests

const EFX = require('..')

work = async () => {
  try {

  // assuming you have a provider running at:
  // http://localhost:8545
  efx = await EFX()

  // check how much ETH is already locked
  let response

  const accounts = await efx.web3.eth.getAccounts()

  for(let account of accounts){

    await efx.account.select(account)

    // unlock wallet so we can sign transactions
    await efx.account.unlock('password')

    response = await efx.contract.locked('ETH')

    const lockedETH = Number(efx.web3.utils.fromWei(response))

    response = await efx.contract.locked('USD')

    const lockedUSD = Number(efx.web3.utils.fromWei(response))

    // check what's the ETH balance for this account
    response = await efx.account.balance()

    const balanceETH = Number(efx.web3.utils.fromWei(response))

    // check what's the USD balance for this account
    response = await efx.account.tokenBalance('USD')

    const balanceUSD = Number(response) / Math.pow(10, 6)

    // lock everything expect 0.1 ETH
    if(balanceETH > 0.1) {

      console.log(`efx.contract.lock('ETH', ${balanceETH - 0.1}, 10)`)

      response = await efx.contract.lock('ETH', balanceETH - 0.1, 10)
    }

    console.log( "balanceUSD ->", balanceUSD )

    // lock all USE
    if(balanceUSD){
      console.log(`efx.contract.lock('USD', ${balanceUSD}, 10)`)

      response = await efx.contract.approve('USD')
      response = await efx.contract.lock('USD', balanceUSD, 10)
    }

    console.log( `Account: ${efx.get('account')}` )
    console.log( ` - balance: ${balanceETH} ETH` )
    console.log( ` - balance: ${balanceUSD} USD` )
    console.log( ` -  locked: ${lockedETH} ETH` )
    console.log( ` -  locked: ${lockedUSD} USD` )

    console.log('')
  }
  } catch(e) {
    console.log( 'e ->', e.stack)
  }

}

work()

