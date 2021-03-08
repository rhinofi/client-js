module.exports = dvf => action => (sendArgsArray = [], value = null, options) => dvf.eth.send(
  dvf.contract.abi.getDVFInterface(),
  dvf.config.DVF.registrationAndDepositInterfaceAddress,
  action,
  sendArgsArray,
  value,
  options
)
