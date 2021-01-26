module.exports = dvf => action => (sendArgsArray = []) => dvf.eth.send(
  dvf.contract.abi.getStarkEx(),
  dvf.config.DVF.starkExContractAddress,
  action,
  ...sendArgsArray
)
