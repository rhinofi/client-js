module.exports = async (dvf, abi, address, action, args, value) => {
  if (dvf.config.send) {
    return dvf.config.send(dvf, abi, address, action, args, value)
  }

  const { web3 } = dvf

  const contract = new web3.eth.Contract(abi, address)
  // console.log(...args)
  const method = contract.methods[action](...args)

  let options = {
    from: dvf.get('account'),
    gasLimit: dvf.config.defaultGasLimit,
    gasPrice: dvf.config.defaultGasPrice,
    ...(value && { value })
  }
  // console.log({ options })
  return method.send(options)
}
