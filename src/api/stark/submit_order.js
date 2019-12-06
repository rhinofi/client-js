const { post } = require('request-promise');
const sw = require('starkware_crypto');

module.exports = async (efx, token, amount, price, timeLimit) => {
	if (!(token && amount && price && timeLimit)) {
		throw new Error('tokenId, amount, price and timeLimit');
  }
  const userAddress = efx.get('account');

	//TODO: check if symbol is a valid symbol

	//TODO:
	//Parameters to be available at client side
	//Generic Parameters

  //User Specific Parameters
  var private_key = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc';
  var key_pair = sw.ec.keyFromPrivate(private_key, 'hex');
  var public_key = sw.ec.keyFromPublic(key_pair.getPublic(true, 'hex'), 'hex');

  const starkKey=public_key.pub.getX().toString()
  const starkKeyPair=key_pair

	const vault_id_sell = 21;
	const vault_id_buy = 27;

	var order = {
		vault_id_sell: vault_id_sell,
		vault_id_buy: vault_id_buy,
		amount_sell: '2154686749748910716',
		amount_buy: '1470242115489520459',
		token_sell: '0x5fa3383597691ea9d827a79e1a4f0f7989c35ced18ca9619de8ab97e661020',
		token_buy: '0x774961c824a3b0fb3d2965f01471c9c7734bf8dbde659e0c08dca2ef18d56a',
		nonce: 0,
		expiration_timestamp: timeLimit,
	};
  let starkMessage='', starkSignature='';
	try {
		//Create stark message for order
		starkMessage = sw.get_limit_order_msg(
			order.vault_id_sell, // vault_sell (uint31)
			order.vault_id_buy, // vault_buy (uint31)
			order.amount_sell, // amount_sell (uint63 decimal str)
			order.amount_buy, // amount_buy (uint63 decimal str)
			order.token_sell, // token_sell (hex str with 0x prefix < prime)
			order.token_buy, // token_buy (hex str with 0x prefix < prime)
			order.nonce, // nonce (uint31)
			order.expiration_timestamp // expiration_timestamp (uint22)
		);

    // starkMessage = sw.get_transfer_msg(
    //   amount, // amount (uint63 decimal str)
    //   nonce='1', // order_id (uint31)
    //   sender_vault_id='1', // temp vault id or sender_vault_id (uint31)
    //   token='0x4e4543',//token, // token (hex str with 0x prefix < prime)
    //   receiver_vault_id='2', // user vault or receiver_vault_id (uint31)
    //   receiver_public_key='0x1', // receiver_public_key (hex str with 0x prefix < prime)
    //   expiration_timestamp='9' // expiration_timestamp (uint22)
    // );
		 //sign using stark crypto library
     starkSignature = sw.sign(starkKeyPair,starkMessage);
     console.log(`stark sign is: ${starkSignature}`)
	} catch (e) {
		console.log(e);
	}
	const data = {
		order,
		price,
		userAddress,
		starkKey,
		starkMessage,
		starkSignature,
	};

	const url = efx.config.api + '/stark/submitOrder';
  console.log(`about to call dvf pub api`)
  return post(url, {json: data})
};
