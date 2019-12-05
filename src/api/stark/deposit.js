const {post} = require('request-promise');
const parse = require('../lib/parse/response/deposit_amount.js');
const sw = require("starkware_crypt0");

module.exports = async (efx, tokenId, amount) => {
  const userAddress = efx.get('account');
  const startKey = '0x234';

  // Basic validation
  if (!tokenId) {
    throw new Error('tokenId is required')
  }

  if (!amount) {
    throw new Error('amount is required')
  }

  // Create quantized amount
  amount = 100

  // tempVault will be available to the client via config
  const tempVaultId = 1 // default DeversiFi vault id
  const vaultId = 2 // users vault id for the tokens that have been deposited

  // Deposit to contract
  const depositStatus = await efx.contract.deposit(vaultId, amount, userAddress);
  await depositStatus.then(receipt => {
    // create stark message and signature using stark crypto library
    // replace get_order_msg with deposit and transfer message when its available

    const starkMessage = sw.get_transfer_msg(
      amount, // amount (uint63 decimal str)
      order_id, // order_id (uint31)
      sender_vault_id, // temp vault id or sender_vault_id (uint31)
      token, // token (hex str with 0x prefix < prime)
      receiver_vault_id, // user vault or receiver_vault_id (uint31)
      receiver_public_key, // receiver_public_key (hex str with 0x prefix < prime)
      expiration_timestamp // expiration_timestamp (uint22)
    );
  
    //sign using stark crypto library
    const starkSignature = sw.sign(starkMessage, key_pair);
    
    }, e => {
      // Error handling, user corrections
      throw new Error('deposit not happened. something went wrong')
  })

  // Send required params to efx-pub-api
  const url = efx.config.api + '/stark/deposit';
  const data = {
    userAddress,
    startKey,
    tempVaultId,
    vaultId,
    tokenId,
    amount,
    starkMessage,
    starkSignature
  };

  return parse(post(url, {json: data}))
}
