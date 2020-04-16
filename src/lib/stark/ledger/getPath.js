/*
Ledger specific helper method to derive Stark Path based on a specific Eth Path
The final derivation logic and the values have not been finalised at moment.
This will require updates once values are finalised for purpose, plugin and application
*/

module.exports = (path) => {
  const m = 21323
  const purpose = 0

  const starkPath = `${m}'/${purpose}`
  return starkPath
}
