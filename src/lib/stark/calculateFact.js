const { keccak256, encodePacked } = require('web3-utils')

module.exports = (recipient, baseUnitsAmount, tokenAddress, salt) => keccak256(
  encodePacked(
    { t: 'address', v: recipient },
    { t: 'uint256', v: baseUnitsAmount },
    { t: 'address', v: tokenAddress },
    { t: 'uint256', v: salt }
  )
// Remove 0x prefix as starkware seems to expect it to be absent.
).substring(2)
