module.exports = async (dvf, abi, address, action, args, value, options = {}) => {
  if (dvf.config.send) {
    return dvf.config.send(dvf, abi, address, action, args, value, options)
  }

  const { web3 } = dvf

  const contract = new web3.eth.Contract(abi, address)
  // console.log(...args)
  const method = contract.methods[action](...args)

  const gasLimit =
    action === 'fullWithdrawalRequest'
      ? 10 * dvf.config.defaultGasLimit
      : 2 * dvf.config.defaultGasLimit

  const gasPrice = await dvf.eth.getGasPrice()

  let sendOptions = {
    from: dvf.get('account'),
    gasLimit: gasLimit,
    gasPrice: gasPrice,
    ...(value && { value })
  }

  const txPromEvent = method.send(sendOptions)
  if (options.transactionHashCb) {
    txPromEvent.on('transactionHash', options.transactionHashCb)
  }
  return txPromEvent
}
