module.exports = async (dvf, abi, address, action, args, value) => {
  console.log('the args', args)
  if (dvf.config.send) {
    return dvf.config.send(dvf, abi, address, action, args, value)
  }

  const { web3 } = dvf

  const contract = new web3.eth.Contract(abi, address)
  // console.log(...args)
  const method = contract.methods[action](...args)

  const gasLimit =
    action === 'fullWithdrawalRequest'
      ? 10 * dvf.config.defaultGasLimit
      : dvf.config.defaultGasLimit

  const gasPrice = await dvf.eth.getGasPrice()

  let options = {
    from: dvf.get('account'),
    gasLimit: gasLimit,
    gasPrice: gasPrice,
    ...(value && { value })
  }
  // console.log({ options })
  return method.send(options)
}
