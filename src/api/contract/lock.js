const BigNumber = require('bignumber.js');
/**
 * Execute 'deposit' method on locker address
 *
 * duration - duration the tokens will be locked, in hours
 */
module.exports = async (efx, token, amount, duration) => {
  const currency = efx.config['0x'].tokenRegistry[token]

  // value we sending to the lockerContract
  const value = (new BigNumber(10)).pow(currency.decimals).times(amount).integerValue(BigNumber.ROUND_FLOOR).toString()

  const action = 'deposit'

  // In order to lock tokens we call deposit with value and forTime
  const args = [
    value, // uint256 value
    duration // uint256 forTime
  ]

  // In order to lock ETH we simply send ETH to the lockerAddress
  if (token === 'ETH') {
    return efx.eth.send(
      efx.contract.abi.locker,
      currency.wrapperAddress,
      action,
      args,
      value // send ETH to the contract
    )
  }

  try {
    return efx.eth.send(
      efx.contract.abi.locker,
      currency.wrapperAddress,
      action,
      args
    )
  } catch(e){
    if(!efx.contract.isApproved(token)){
      return {
        error: 'ERR_CORE_ETHFX_NEEDS_APPROVAL',
        reason: reasons.ERR_CORE_ETHFX_NEEDS_APPROVAL.trim()
      }
    } else {
      throw(e)
    }
  }
}
