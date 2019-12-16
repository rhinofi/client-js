const { post } = require('request-promise')

module.exports = async (efx, token, amount) => {
  const userAddress = efx.get('account')

  // Basic validation
  if (!token || !amount) {
    throw new Error('tokenId and amount required')
  }

  // TODO:
  // Parameters to be available at client side
  // Generic Parameters
  const tempVaultId = 1
  const tokenId = 12345
  const vaultId = 2

  // User Specific Parameters
  var private_key =
    '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
  const { starkKeyPair, starkKey } = efx.stark.getKeyPairs(private_key)
  var starkMessage = '',
    starkSignature = ''
  try {
    // const depositStatus = await efx.contract.deposit(tempVaultId, amount, userAddress);
    // console.log(`deposit contract call result: ${depositStatus}`, depositStatus)

    // create stark message and signature using stark crypto library
    // replace get_order_msg with deposit and transfer message when its available
    starkMessage = efx.stark.getTransferMsg(
      amount,
      '1', // nonce
      '1', // sender_vault_id
      '0x4e4543', // token
      '2', // receiver_vault_id
      '0x1', // receiver_public_key
      '9' // expiration_timestamp
    ).starkMessage

    starkSignature = efx.stark.sign(starkKeyPair, starkMessage)
    console.log(`stark sign is: ${starkSignature}`)
  } catch (e) {
    console.log(`error: ${e}`)
    // Error handling, user corrections
    console.log('deposit not happened. something went wrong')
  }

  // Call dvf pub api
  const url = efx.config.api + '/stark/deposit'
  const data = {
    userAddress,
    starkKey,
    tempVaultId,
    vaultId,
    tokenId,
    amount,
    starkMessage,
    starkSignature
  }

  console.log(`about to call dvf pub api`)
  return post(url, { json: data })
}
