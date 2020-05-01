const getBits = require('./getBits')

/*
Ledger specific helper method to derive Stark Path based on a specific Eth Address
The final derivation logic and the values have not been finalised at moment.
This will require updates once values are finalised for purpose, plugin and application
*/

module.exports = (dvf, address) => {
  // derived values
  const ethAddressA = getBits(address)
  const ethAddressB = getBits(address, 1)

  const starkPath = `
    ${dvf.config.m}'
    /${dvf.config.purpose}'
    /${dvf.config.plugin}'
    /${dvf.config.application}'
    /${ethAddressA}'
    /${ethAddressB}'
    /${dvf.config.accountIndex}
    `
  return starkPath.replace(/\s+/g, '')
}
