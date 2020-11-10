const getBits = require('./getBits')

/*
Ledger specific helper method to derive Stark Path based on a specific Eth Address
The final derivation logic and the values have not been finalised at moment.
This will require updates once values are finalised for purpose, plugin and application

accountIndex is currently not used but is available for future use

reference to derivation logic: https://github.com/ethereum/EIPs/pull/2645
*/

module.exports = (dvf, address, accountIndex = 0) => {
  // derived values
  const addressBits = getBits(address)

  const starkPath = `
    ${dvf.config.purpose}'
    /${dvf.config.plugin}'
    /${dvf.config.application}'
    /${addressBits[0]}'
    /${addressBits[1]}'
    /${accountIndex || dvf.config.accountIndex}
    `
  return starkPath.replace(/\s+/g, '')
}
