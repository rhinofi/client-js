module.exports = async (dvf, tradingKey, deFiSignature, ethAddress) => {
  ethAddress = ethAddress || dvf.get('account')

  const action = 'registerUser'

  const args = [ethAddress, `0x${tradingKey}`, deFiSignature]

  await dvf.eth.send(
    dvf.contract.abi.getStarkEx(),
    dvf.config.DVF.starkExContractAddress,
    action,
    args
  )

  return true
}
