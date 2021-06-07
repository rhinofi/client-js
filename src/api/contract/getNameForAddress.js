/**
 * Gets token name
 */
module.exports = (dvf, tokenAddress) => {
  const action = 'name'
  return dvf.eth.call(
    dvf.contract.abi.token,
    tokenAddress,
    action,
    []
  )
}
