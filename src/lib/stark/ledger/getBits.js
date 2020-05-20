/*
Returns 2 least significant bit blocks of 31 bits each
*/

module.exports = (address) => {
  // address to bits
  const hBits = BigInt(address).toString(2)
  // last and second last 31 bit blocks
  const first31Bits = parseInt(hBits.slice(-31),2)
  const second31Bits = parseInt(hBits.slice(-62,-31),2)

  return [first31Bits,second31Bits]
}
