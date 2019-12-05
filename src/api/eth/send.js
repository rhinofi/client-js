module.exports = async (efx, abi, address, action, args, value = 0) => {
  if (efx.config.send){
    return efx.config.send(efx, abi, address, action, args, value)
  }

  const { web3 } = efx

  const contract = new web3.eth.Contract(abi, address)

  const method = contract.methods[action](...args)

  const estimatedGas = await method.estimateGas({
    from: efx.get('account'),
    value: value
  })

  let options = {
    from: efx.get('account'),
    value: value,
    gas: estimatedGas
  }

  if(efx.get('gasPrice')){
    options.gasPrice = efx.get('gasPrice')
  }

  return method.send(options)
}
