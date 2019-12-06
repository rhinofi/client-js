const {post} = require('request-promise');
const sw = require('starkware_crypto');

module.exports = async (efx, token, amount) => {
  const userAddress = efx.get('account');
  

  // Basic validation
  if (!token) {
    throw new Error('tokenId is required')
  }

  if (!amount) {
    throw new Error('amount is required')
  }

  //TODO: 
  //Parameters to be available at client side
  //Generic Parameters
  const tempVaultId=1
  const tokenId=12345;
  //User Specific Parameters
  var private_key = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc';
  var key_pair = sw.ec.keyFromPrivate(private_key, 'hex');
  var public_key = sw.ec.keyFromPublic(key_pair.getPublic(true, 'hex'), 'hex');

  const starkKey=public_key.pub.getX().toString();
  const starkKeyPair=key_pair
  const vaultId=2


  let starkMessage='', starkSignature='';
  try
  {
    console.log(`calling deposit contract`)
    // const depositStatus = await efx.contract.deposit(tempVaultId, amount, userAddress);
    // console.log(`deposit contract call result: ${depositStatus}`, depositStatus)
    
    // create stark message and signature using stark crypto library
    // replace get_order_msg with deposit and transfer message when its available
    starkMessage = sw.get_transfer_msg(
      amount, // amount (uint63 decimal str)
      nonce='1', // order_id (uint31)
      sender_vault_id='1', // temp vault id or sender_vault_id (uint31)
      token='0x4e4543',//token, // token (hex str with 0x prefix < prime)
      receiver_vault_id='2', // user vault or receiver_vault_id (uint31)
      receiver_public_key='0x1', // receiver_public_key (hex str with 0x prefix < prime)
      expiration_timestamp='9' // expiration_timestamp (uint22)
    );

    console.log(`stark message is: ${starkMessage}`)
  
    //sign using stark crypto library
    starkSignature = sw.sign(starkKeyPair,starkMessage);
    
    console.log(`stark sign is: ${starkSignature}`)
    }
    catch(e) {
      console.log(`error: ${e}`)
      // Error handling, user corrections
      console.log('deposit not happened. something went wrong')
  }

  // Call dvf pub api
  const url = efx.config.api + '/stark/deposit';
  const data = {
    userAddress,
    starkKey,
    tempVaultId,
    vaultId,
    tokenId,
    amount,
    starkMessage,
    starkSignature
  };

  console.log(`about to call dvf pub api`)
  return post(url, {json: data})
}
