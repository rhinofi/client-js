module.exports = (efx, token) => {
  const currency = efx.token.getTokenInfo(token)
  const action = 'balanceOf'
  const args = [efx.get('account')]

  return efx.eth.call(
    efx.contract.abi.token,
    currency.wrapperAddress,
    action,
    args
  )
}
