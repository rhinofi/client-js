const getTokenAddressFromTokenInfoOrThrow = require('../../lib/dvf/token/getTokenAddressFromTokenInfoOrThrow')

module.exports = (dvf, token, chain = 'ETHEREUN') => {
  const tokenInfo = dvf.token.getTokenInfo(token)
  const action = 'balanceOf'
  const args = [dvf.get('account')]
  const tokenAddress = getTokenAddressFromTokenInfoOrThrow(tokenInfo, chain)

  return dvf.eth.call(
    dvf.contract.abi.token,
    tokenAddress,
    action,
    args
  )
}
