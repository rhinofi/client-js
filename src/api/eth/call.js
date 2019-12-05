module.exports = async (efx, abi, address, action, args, options = {}) => {
  const { web3 } = efx

  const contract = new web3.eth.Contract(abi, address)

  // using eth.call
  // parseInt( response, 16 ) to convert int
  /**
  return efx.web3.eth.call({
    to: address,
    data: contract.methods[action](...args).encodeABI()
  })
   **/

  return contract.methods[action](...args).call()
}
