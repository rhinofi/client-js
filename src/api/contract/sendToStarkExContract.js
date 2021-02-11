module.exports = dvf => action => (args, value, options) => dvf.eth.send(
  dvf.contract.abi.getStarkEx(),
  dvf.config.DVF.starkExContractAddress,
  action,
  args,
  value,
  options
)
