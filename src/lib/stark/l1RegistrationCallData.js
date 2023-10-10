/**
 * @type {(dvf: ReturnType<import('../dvf/bindApi')>,
 * tradingKey: string,
 * ethAddress: string,
 * starkLRegistrationSignature: string) => string}
 */
module.exports = async (dvf, starkKeyHex, ethAddress, starkL1RegistrationSignature) => {
  const starkExContract = new dvf.web3.eth.Contract(
    dvf.contract.abi.getStarkEx(),
    dvf.config.DVF.starkExContractAddress,
  )

  const callData = starkExContract.methods.registerEthAddress(
    ethAddress,
    starkKeyHex,
    starkL1RegistrationSignature
  ).encodeABI()

  return callData
}
