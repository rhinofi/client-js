module.exports = (dvf, token) => {
  const currency = dvf.token.getTokenInfo(token)
  const action = 'balanceOf'
  const args = [dvf.get('account')]

  return dvf.eth.call(
    dvf.contract.abi.token,
    currency.tokenAddress,
    action,
    args
  )
}
