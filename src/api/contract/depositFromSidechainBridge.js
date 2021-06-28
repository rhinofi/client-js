
module.exports = (dvf, { bridgeContractAddress, tokenAddress, baseUnitAmount }, options) => {
  const [action, args, value] = tokenAddress === '0x0000000000000000000000000000000000000000'
    // For native token (ie: MATIC on Polygon), use specifoc method and pass amount as value
    ? ['depositNative', [], baseUnitAmount]
    // For other tokens, use amount as argument (in baseUnits, unlike starkEx deposits)
    : ['deposit', [tokenAddress, baseUnitAmount]]

  return dvf.eth.send(
    dvf.contract.abi.getSidechainBridgeInterface(),
    bridgeContractAddress,
    action,
    args,
    value,
    options
  )
}
