module.exports = (dvf, orderId) => {
  // orderId = utils.sha3(orderId.toString(16))

  // const toSign = utils.bufferToHex(orderId).slice(2)

  return dvf.sign(orderId.toString(16))
}
