module.exports = async (dvf, abi, address, action, args, value, options = {}) => {
  if (dvf.config.send) {
    return dvf.config.send(dvf, abi, address, action, args, value, options)
  }

  const { web3 } = dvf

  const contract = new web3.eth.Contract(abi, address)
  const method = contract.methods[action](...args)

  const gasLimit =
    action === 'fullWithdrawalRequest'
      ? 10 * dvf.config.defaultGasLimit
      : dvf.config.defaultGasLimit

  const gasPrice = await dvf.eth.getGasPrice()
  const { id: chainId } = await dvf.eth.getNetwork()

  let sendOptions = {
    chainId,
    from: dvf.get('account'),
    gasLimit: gasLimit,
    gasPrice: gasPrice,
    ...(value && { value })
  }

  const txPromEvent = method.send(sendOptions)
  if (options.transactionHashCb) {
    txPromEvent.on('transactionHash', (txHash) => options.transactionHashCb(null, txHash))
    txPromEvent.catch(error => {
      options.transactionHashCb(error)
      throw error
    })
  }
  return txPromEvent
}
