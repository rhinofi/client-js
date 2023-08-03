const DVFError = require('../dvf/DVFError')
const sw = require('@rhino.fi/starkware-crypto')
const { utils } = require('web3')

// Constant from Starkware contract 
// https://github.com/starkware-libs/starkex-contracts/blob/210bd5f6bcb6977211677821fe925140859a0f6e/scalable-dex/contracts/src/components/ECDSA.sol#L13-L14
const EC_ORDER = utils.BN('3618502788666131213697322783095070105526743751716087489154079457884512865583')

/**
 * @type {(dvf: ReturnType<import('../dvf/bindApi')>,
 * starkHex: string,
 * ethAddress: string) => utils.BN}
 */
module.exports = (dvf, starkHex, ethAddress) => {
  if (!ethAddress) {
    throw new Error('ethAddress is required')
  }

  if (!starkHex) {
    throw new Error('starkKeyHex is required')
  }

  /*
  uint256 msgHash = uint256(
      keccak256(abi.encodePacked("UserRegistration:", ethKey, starkKey))
  ) % ECDSA.EC_ORDER;
  */

  try {
    const hashedMessage = utils.soliditySha3(
      utils.encodePacked(
        { value: 'UserRegistration:', type: 'string' },
        { value: ethAddress, type: 'address' },
        { value: starkHex, type: 'uint256' },
      )
    )

    const message = utils.BN(hashedMessage).mod(EC_ORDER).toString(16)

    return message
  } catch (error) {
    throw new DVFError('ERR_CREATING_STARK_REGISTRATION_MESSAGE', { error })
  }
}
