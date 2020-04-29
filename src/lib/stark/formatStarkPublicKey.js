/*
ensure stark Key is always 64 bits
*/
module.exports = (starkPublicKey) => {
  return {
    x: starkPublicKey.x.padStart(64, '0').substr(-64),
    y: starkPublicKey.y
  }
}
