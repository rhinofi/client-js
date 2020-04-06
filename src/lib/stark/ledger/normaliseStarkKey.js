/*
remove leding zeros from x part of stark public key to
accomodate public keys created by ledger wallet
*/
module.exports = (starkPublicKey) => {
  const regex = /^0+/
  return {
    x: starkPublicKey.x.replace(regex, ''),
    y: starkPublicKey.y
  }
}
