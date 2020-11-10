/**
 * Checksum function described here:
 * https://github.com/ethereum/web3.js/issues/1277
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
 *
 * NOTE: not used yet, but perhaps better than using .toLowerCase()
 * as we are currently doing
 */
const createKeccakHash = require('keccak')

module.exports = (address) => {
  address = address.toLowerCase().replace('0x', '')

  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var checksum = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksum += address[i].toUpperCase()
    } else {
      checksum += address[i]
    }
  }

  return checksum
}
