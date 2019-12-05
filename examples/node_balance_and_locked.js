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

  const lockedETH = Number(efx.web3.utils.fromWei(response)).toFixed(8)

  response = await efx.contract.locked('USD')

  const lockedUSD = Number(efx.web3.utils.fromWei(response)).toFixed(8)

  // check what's the ETH balance for this account
  response = await efx.account.balance()

  const balanceETH = Number(efx.web3.utils.fromWei(response)).toFixed(8)

  // check what's the USD balance for this account
  response = await efx.account.tokenBalance('USD')

  const balanceUSD = Number(response) / Math.pow(10, 6)

  console.log( `Your account: ${efx.get('account')}` )
  console.log( ` - balance: ${balanceETH} ETH` )
  console.log( ` - balance: ${balanceUSD} USD` )
  console.log( ` -  locked: ${lockedETH} ETH` )
  console.log( ` -  locked: ${lockedUSD} USD` )

}

work()

