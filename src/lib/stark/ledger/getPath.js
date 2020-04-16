const getBits = require('./getBits')

/*
Ledger specific helper method to derive Stark Path based on a specific Eth Address
The final derivation logic and the values have not been finalised at moment.
This will require updates once values are finalised for purpose, plugin and application
*/

module.exports = (address) => {
  console.log({ address })
  // constants
  const m = 21323
  const plugin = 1106451151
  const application = 1681080391
  const accountIndex = 0

  // derived valaues
  const ethAddressA = getBits(address)
  const ethAddressB = getBits(address, 1)

  // temperory value
  const purpose = 0

  const starkPath = `${m}'/${purpose}'/${plugin}'/${application}'/${ethAddressA}'/${ethAddressB}'/${accountIndex}`
  console.log({ starkPath })
  return starkPath
}
