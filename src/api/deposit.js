const { post } = require('request-promise')

module.exports = async (efx, token, amount, starkKey, starkKeyPair) => {
  const ownerAddress = efx.get('account')

  // Basic validation
  if (!token || !amount) {
    throw new Error('tokenId and amount required')
  }

  if (!efx.config.tokenRegistry[token]) {
    throw new Error('Required token details not found')
  }
  // TODO:
  // Parameters to be available at client side
  // Generic Parameters
  const tempVaultId = 1
  const tokenId = efx.config.tokenRegistry[token].starkTokenId
  const vaultId = efx.config.tokenRegistry[token].starkVaultId

  var starkMessage = '',
    starkSignature = ''
  try {
    // const depositStatus = await efx.contract.deposit(tempVaultId, amount, ownerAddress);
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
      (Math.floor(Date.now()/(1000*3600))+efx.config.defaultExpiry) // expiration_timestamp
    ).starkMessage

    starkSignature = efx.stark.sign(starkKeyPair, starkMessage)
    console.log(`stark sign is: ${starkSignature}`)
  } catch (e) {
    console.log(`error: ${e}`)
    // Error handling, user corrections
    console.log('deposit not happened. something went wrong')
  }

  // Call dvf pub api
  const url = efx.config.api + '/w/deposit'
  const data = {
    ownerAddress,
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
