module.exports = async (dvf, abi, address, action, args, value = 0) => {
  if (dvf.config.send) {
    return dvf.config.send(dvf, abi, address, action, args, value)
  }

  const { web3 } = dvf

  const contract = new web3.eth.Contract(abi, address)

  const method = contract.methods[action](...args)

  const estimatedGas = await method.estimateGas({
    from: dvf.get('account'),
    value: value
  })

  let options = {
    from: dvf.get('account'),
    value: value,
    gas: estimatedGas
  }

  if (dvf.get('gasPrice')) {
    options.gasPrice = dvf.get('gasPrice')
  }

  return method.send(options)
}
