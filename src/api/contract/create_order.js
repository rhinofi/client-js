const { generatePseudoRandomSalt } = require('@0x/order-utils');
const BigNumber = require('bignumber.js');
const sw = require('starkware_crypto');

module.exports = (efx, symbol, amount, price, validFor, fee_rate = 0.0025, vault_id_buy, vault_id_sell) => {
	// symbols are always 3 letters
	const baseSymbol = symbol.substr(0, symbol.length - 3);
	const quoteSymbol = symbol.substr(-3);

	const buySymbol = amount > 0 ? baseSymbol : quoteSymbol;
	const sellSymbol = amount > 0 ? quoteSymbol : baseSymbol;

	const sellCurrency = efx.config['0x'].tokenRegistry[sellSymbol];
	const buyCurrency = efx.config['0x'].tokenRegistry[buySymbol];

	let buyAmount, sellAmount;

	if (amount > 0) {
		buyAmount = new BigNumber(10)
			.pow(buyCurrency.decimals)
			.times(amount)
			.times(1 + (buyCurrency.settleSpread || 0))
			.times(1 - fee_rate)
			.integerValue(BigNumber.ROUND_FLOOR);

		sellAmount = new BigNumber(10)
			.pow(sellCurrency.decimals)
			.times(amount)
			.times(price)
			.times(1 + (sellCurrency.settleSpread || 0))
			.integerValue(BigNumber.ROUND_FLOOR);

		// console.log( "Buying " + amount + ' ' + buySymbol + " for: " + price + ' ' + sellSymbol )
	}

	if (amount < 0) {
		buyAmount = new BigNumber(10)
			.pow(buyCurrency.decimals)
			.times(amount)
			.times(price)
			.abs()
			.times(1 + (buyCurrency.settleSpread || 0))
			.times(1 - fee_rate)
			.integerValue(BigNumber.ROUND_FLOOR);

		sellAmount = new BigNumber(10)
			.pow(sellCurrency.decimals)
			.times(amount)
			.abs()
			.times(1 + (sellCurrency.settleSpread || 0))
			.integerValue(BigNumber.ROUND_FLOOR);

		// console.log( "Selling " + Math.abs(amount) + ' ' + sellSymbol + " for: " + price + ' ' + buySymbol )
	}

	let expiration;
	expiration = Math.round(new Date().getTime() / 1000);
	expiration += validFor || config.defaultExpiry;

	var starkOrder = {
		vault_id_sell: vault_id_sell,
		vault_id_buy: vault_id_buy,
		amount_sell: amount_sell,
		amount_buy: amount_buy,
		token_sell: sellCurrency.tokenId,
		token_buy: buyCurrency.tokenId,
		nonce: generatePseudoRandomSalt(),
		expiration_timestamp: new BigNumber(expiration),
	};

	let starkMessage = '';
	try {
		//Create stark message for order
		starkMessage = sw.get_limit_order_msg(
			vault_id_sell, // vault_sell (uint31)
			vault_id_buy, // vault_buy (uint31)
			amount_sell, // amount_sell (uint63 decimal str)
			amount_buy, // amount_buy (uint63 decimal str)
			sellCurrency.tokenId, // token_sell (hex str with 0x prefix < prime)
			buyCurrency.tokenId, // token_buy (hex str with 0x prefix < prime)
			starkOrder.nonce, // nonce (uint31)
			starkOrder.expiration_timestamp // expiration_timestamp (uint22)
		);
	} catch (e) {
		throw 'unable to create stark order message';
	}
	return {
		starkOrder: starkOrder,
		starkMessage: starkMessage,
	};
};
