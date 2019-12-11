const { post } = require('request-promise');
const sw = require('starkware_crypto');

module.exports = async (
	efx,
	symbol,
	amount,
	price,
	gid,
	cid,
	signedOrder,
	validFor,
	partner_id,
	fee_rate,
	dynamicFeeRate
) => {
	if (!(symbol && amount && price && validFor)) {
		throw new Error('symbol, amount, price and timeLimit');
	}
	const userAddress = efx.get('account');

	if (!fee_rate) {
		if (!dynamicFeeRate) {
			dynamicFeeRate = await efx.getFeeRate(symbol, amount, price);
		}
		fee_rate = dynamicFeeRate.feeRate.feeBps / 10000;
	}
	var order='';
	//create order object
	if (!signedOrder) {
		order = efx.contract.createOrder(symbol, amount, price, validFor, fee_rate);
		signedOrder = await efx.sign.order(order);
	}

	const meta = signedOrder;
	const type = 'EXCHANGE LIMIT';
	const protocol = 'stark';
	symbol = 't' + symbol;
	const data = {
		gid,
		cid,
		type,
		symbol,
		amount,
		price,
		meta,
		protocol,
		partner_id,
		fee_rate,
		dynamicFeeRate,
	};
	//TODO:
	//Parameters to be available at client side
	//Generic Parameters required via config
	//token ids for buy and sell tokens need to be available at client side
	const tokenId_sell ='0x5fa3383597691ea9d827a79e1a4f0f7989c35ced18ca9619de8ab97e661020'
	const tokenId_buy ='0x774961c824a3b0fb3d2965f01471c9c7734bf8dbde659e0c08dca2ef18d56a'
	//User Specific Parameters required via getUserConfig
	var private_key = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'
	var key_pair = sw.ec.keyFromPrivate(private_key, 'hex');
	var public_key = sw.ec.keyFromPublic(key_pair.getPublic(true, 'hex'), 'hex')

	const starkKey = public_key.pub.getX().toString()
	const starkKeyPair = key_pair

	const vault_id_sell = 21
	const vault_id_buy = 27

	var starkOrder = {
		vault_id_sell: vault_id_sell,
		vault_id_buy: vault_id_buy,
		amount_sell: order.amount_sell,
		amount_buy: order.amount_buy,
		token_sell: tokenId_sell,
		token_buy: tokenId_buy,
		nonce: order.salt,
		expiration_timestamp: order.expirationTimeSeconds
	};
	let starkMessage = '',
		starkSignature = '';
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

		starkSignature = sw.sign(starkKeyPair, starkMessage);
		console.log(`stark sign is: ${starkSignature}`);
	} catch (e) {
		console.log(e);
	}
	data.meta ={
		starkOrder,
		starkMessage,
		userAddress,
		starkKey,
		starkSignature,
	};

	const url = efx.config.api + '/stark/submitOrder';
	console.log(`about to call dvf pub api`);
	return post(url, { json: data });
};
