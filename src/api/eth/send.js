module.exports = async (dvf, abi, address, action, args, value = 0) => {
  if (dvf.config.send) {
    return dvf.config.send(dvf, abi, address, action, args, value)
  }

  const { web3 } = dvf

  const contract = new web3.eth.Contract(abi, address)

  const method = contract.methods[action](...args)

  let options = {
    from: dvf.get('account'),
    // value: value,
    gasLimit: 200000,
    gasPrice: 14000000000
  }

  if (dvf.get('gasPrice')) {
    options.gasPrice = dvf.get('gasPrice')
  }

  return method.send(options)
}
