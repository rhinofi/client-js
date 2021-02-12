module.exports = dvf => action => (sendArgsArray = [], value = null) => dvf.eth.send(
  dvf.contract.abi.getDVFInterface(),
  '0xeccac43fc2f30b4765335278294d1eec6c3c2174', // dvf.config.DVF.interfaceContractAddress,
  action,
  sendArgsArray,
  value
)
