module.exports = async (dvf, tradingKey, deFiSignature, ethAddress) => {
  throw new Error('Direct Registration to StarkExv4 is not supported via this function')

  // Signature generation for StarkExv4 to be implemented and
  // Tested. The previous logic used exchange's signature
  // to register users

  // ethAddress = ethAddress || dvf.get('account')

  // const args = [ethAddress, `0x${tradingKey}`, deFiSignature]

  // await dvf.eth.send(
  //   dvf.contract.abi.getStarkEx(),
  //   dvf.config.DVF.starkExContractAddress,
  //   'registerEthAddress',
  //   args
  // )

  // return true
}
