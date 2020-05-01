/*
Returns the 31 bits of a hash
The first 31 bits are returns if n is 0 or not passed
The nth 31 bits are returned if n is present and greater than 0
*/

module.exports = (h, n = 0) => {
  // to Big Number
  const hBigNumber = BigInt(h)
  // n block of 31 bits
  const hBits = hBigNumber.toString(2).substr(n * 31, 31)
  // first 31 bits in decimal format
  return parseInt(hBits, 2)
}
