const utils = require('ethereumjs-util')

module.exports = (message, signature) => {
  const prefix = new Buffer('\x19Ethereum Signed Message:\n')

  message = new Buffer(message)

  const prefixedMsg = utils.sha3(
    Buffer.concat([prefix, new Buffer(String(message.length)), message])
  )

  const res = utils.fromRpcSig(signature)

  const pubKey = utils.ecrecover(
    prefixedMsg,
    res.v, res.r, res.s
  )

  // return address from this pubKey
  return utils.bufferToHex(utils.pubToAddress(pubKey))
}
