const BigNumber = require('bignumber.js');
/**
 * Call unlock method on wrapper contract
 */
module.exports = async (efx, token, amount, nonce, signature) => {
  const currency = efx.config['0x'].tokenRegistry[token]

  // value we asking to unlock
  const value = (new BigNumber(10)).pow(currency.decimals).times(amount).integerValue(BigNumber.ROUND_FLOOR).toString()

  const action = 'withdraw'

  // get timestamp for depositLock
  const depositLock = await efx.contract.depositLock(token)

  // arguments for the contract call
  let args = [value]

  // no need to call releaseTokens
  if( Date.now() / 1000 > depositLock ) {
    args = args.concat([0, '0x0000000000000000000000000000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000000000000000000000000000', 0])
  }

  // we need to call releaseTokens to fetch a signed permission to unlock
  if( Date.now() / 1000 < depositLock ) {
    const response = await efx.releaseTokens(token, nonce, signature)

    if(response.error) return response

    const sig = response.releaseSignature

    // push values into arguments array
    args = args.concat([sig.v, sig.r, sig.s, response.unlockUntil])
  }

  return efx.eth.send(
    efx.contract.abi.locker,
    currency.wrapperAddress,
    action,
    args
  )
}
