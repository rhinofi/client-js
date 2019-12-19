/* eslint-env mocha */
const { assert } = require('chai');
const nock = require('nock');
const mockGetConf = require('./fixtures/nock/get_conf');
const mockGetUserConf = require('./fixtures/nock/get_user_conf');
const mockFeeRate = require('./fixtures/nock/feeRate');
const instance = require('./helpers/instance');
const utils = require('ethereumjs-util');
const sw = require('starkware_crypto');

// TODO: use arrayToOrder to convert response from HTTP API
// const orderToArray = require('lib-js-util-schema')
const ecRecover = require('./helpers/ecRecover');

let efx;

before(async () => {
	mockGetConf();
	mockGetUserConf();
	efx = await instance();
});

describe('/deposit', () => {
	// 1st test_case
	it("Deposit token to user's vault", async () => {
		const apiResponse = { deposit: 'success' };
		const pvtKey = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc';

		const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex');
		const publicKey = sw.ec.keyFromPublic(starkKeyPair.getPublic(true, 'hex'), 'hex');
		const starkKey = publicKey.pub.getX().toString();
		const amount = 100;
		const token = 'ZRX';

		nock('https://staging-api.deversifi.com/')
			.post('/v1/trading/w/deposit', async body => {
				assert.equal(body.ownerAddress, '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404');
				assert.equal(body.starkKey, starkKey);
				assert.equal(body.tempVaultId, '1');
				assert.equal(body.vaultId, efx.config.tokenRegistry[token].starkVaultId);
				assert.equal(body.tokenId, efx.config.tokenRegistry[token].starkTokenId);
				assert.equal(body.amount, amount);
				assert.ok(body.starkMessage);
				assert.ok(body.starkSignature);
				return true;
			})
			.reply(200, apiResponse);

    const result = await efx.deposit(token, amount, starkKey, starkKeyPair);
    console.log('new res ', result)
  });
  
	// 2nd test_case
	it("Deposit token checks for invalid amount", async () => {
		const apiResponse = { deposit: 'success' };
		const pvtKey = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc';

		const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex');
		const publicKey = sw.ec.keyFromPublic(starkKeyPair.getPublic(true, 'hex'), 'hex');
    const starkKey = publicKey.pub.getX().toString();
    //checks for 0, negative or empty amount
		const amount = 0;
		const token = 'ZRX';

		nock('https://staging-api.deversifi.com/')
			.post('/v1/trading/w/deposit', async body => {
        assert.equal(body.error,"INVALID_AMOUNT")
				return true;
			})
			.reply(200, apiResponse);

    const result = await efx.deposit(token, amount, starkKey, starkKeyPair);
    console.log('new res ', result)
  });
  
  // 3rd test_case
	it("Deposit token checks for missing token", async () => {
		const apiResponse = { deposit: 'success' }
		const pvtKey = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'

		const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
		const publicKey = sw.ec.keyFromPublic(starkKeyPair.getPublic(true, 'hex'), 'hex')
		const starkKey = publicKey.pub.getX().toString()
		const amount = 57
		const token = ''

		nock('https://staging-api.deversifi.com/')
			.post('/v1/trading/w/deposit', async body => {
        assert.equal(body.error,"MISSING_TOKEN")
				return true
			})
			.reply(200, apiResponse);

    const result = await efx.deposit(token, amount, starkKey, starkKeyPair);
    console.log('new res ', result)
  });
  
  // 4th test_case
	it("Deposit token checks for invalid token", async () => {
		const apiResponse = { deposit: 'success' }
		const pvtKey = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc'

		const starkKeyPair = sw.ec.keyFromPrivate(pvtKey, 'hex')
		const publicKey = sw.ec.keyFromPublic(starkKeyPair.getPublic(true, 'hex'), 'hex')
		const starkKey = publicKey.pub.getX().toString()
		const amount = 57
		const token = 'XYZ'

		nock('https://staging-api.deversifi.com/')
			.post('/v1/trading/w/deposit', async body => {
        assert.equal(body.error,"INVALID_TOKEN")
				return true
			})
			.reply(200, apiResponse);

    const result = await efx.deposit(token, amount, starkKey, starkKeyPair);
    console.log('new res ', result)
	});
})

describe('/submitOrder', () => {
	it('dvf pub api submit order....', async () => {
		const apiResponse = { starkSubmitOrder: 'success' };

		// User Specific Parameters
		var private_key = '3c1e9550e66958296d11b60f8e8e7a7ad990d07fa65d5f7652c4a6c87d4e3cc';
		var key_pair = sw.ec.keyFromPrivate(private_key, 'hex');
		var public_key = sw.ec.keyFromPublic(key_pair.getPublic(true, 'hex'), 'hex');
		const starkKey = public_key.pub.getX().toString();
		const starkKeyPair = key_pair;

		nock('https://staging-api.deversifi.com/')
			.post('/v1/trading/w/submitOrder', async body => {
				console.log(`body: ${body}`, body);
				assert.equal(body.meta.ownerAddress, '0x65CEEE596B2aba52Acc09f7B6C81955C1DB86404');
				assert.equal(
					body.meta.starkKey,
					'3382153814239323293087870650452838988136913683747955644970514321018482846275'
				);
				assert.ok(body.meta.starkSignature);
				return true;
			})
			.reply(200, apiResponse);

		const result = await efx.submitOrder(
			'ETHUSD', // symbol
			'0.1', // amount
			1000, // price
			'', // gid
			'', // cid
			'0', // signedOrder
			'0', // validFor
			'', // partnerId
			'', // feeRate
			'', // dynamicFeeRate
			starkKey,
			starkKeyPair
		);

		console.log('got result =>', result);
	});

	it('dvf pub api getBalance....', async () => {
		const apiResponse = { starkBalance: 'success' };

		nock('https://staging-api.deversifi.com/')
			.post('/v1/trading/r/getBalance', async body => {
				console.log(`body: ${body}`, body);
				assert.equal(body.token, 'ETH');
				assert.ok(body.signature);
				return true;
			})
			.reply(200, apiResponse);

		const result = await efx.getBalance('ETH');
		console.log('got result for balance =>', result);
	});

	it('dvf pub api cancelOrder....', async () => {
		const orderId = 1;
		const signedOrder = await efx.sign.cancelOrder(orderId);
		const apiResponse = [1234];

		nock('https://staging-api.deversifi.com/')
			.post('/v1/trading/w/cancelOrder', async body => {
				console.log('body: ', body);
				assert.equal(body.orderId, orderId);
				return true;
			})
			.reply(200, apiResponse);

		const response = await efx.cancelOrder(orderId);
		console.log('response: ', response);
		assert.deepEqual(response, apiResponse);
	});

	it('dvf pub api getOrder....', async () => {
		const orderId = 1;
		const apiResponse = [[1234]];
		const nonce = Date.now() / 1000 + 60 * 60 * 24 + '';
		const signature = await efx.sign(nonce.toString(16));

		nock('https://staging-api.deversifi.com/')
			.post('/v1/trading/r/getOrders', async body => {
				assert.equal(body.id, orderId);
				assert.equal(body.protocol, '0x');
				assert.ok(body.nonce);
				assert.ok(body.signature);

				let toSign = body.nonce.toString(16);
				const recovered = ecRecover(toSign, body.signature);
				assert.equal(efx.get('account').toLowerCase(), recovered.toLowerCase());

				return true;
			})
			.reply(200, apiResponse);
		const response = await efx.getOrder(orderId, nonce, signature);
		console.log('getOrder response: ', response);
		assert.deepEqual(response, apiResponse);
	});

	it('dvf pub api getOrders....', async () => {
		const apiResponse = [[1234], [1235]];

		nock('https://staging-api.deversifi.com/')
			.post('/v1/trading/r/getOrders', async body => {
				assert.equal(body.protocol, '0x');
				assert.ok(body.nonce);
				assert.ok(body.signature);

				let toSign = body.nonce.toString(16);
				const recovered = ecRecover(toSign, body.signature);
				assert.equal(efx.get('account').toLowerCase(), recovered.toLowerCase());

				return true;
			})
			.reply(200, apiResponse);
		const response = await efx.getOrders();
		console.log('getOrder response: ', response);
		assert.deepEqual(response, apiResponse);
	});

	it('dvf pub api getOrdersHist....', async () => {
		const httpResponse = [
			{
				_id: '5b56333fd952c07b351c5940',
				id: '1151079509',
				type: 'EXCHANGE LIMIT',
				pair: 'ETHUSD',
				status: 'CANCELED',
				created_at: '2018-07-21 16:15:58',
				updated_at: '2018-07-23 19:52:51',
				user_id: 5,
				amount: '-0.10000000',
				price: '10000.00000000',
				originalamount: '-0.10000000',
				routing: 'BFX',
				lockedperiod: 0,
				trailingprice: '0.00000000',
				hidden: 0,
				vir: 0,
				maxrate: '0.00000000000000000000',
				placed_id: null,
				placed_trades: null,
				nopayback: null,
				avg_price: '0.00000000000000000000',
				active: 0,
				fiat_currency: 'USD',
				cid: '58558087372',
				cid_date: '2018-07-21',
				mseq: '2',
				gid: null,
				flags: null,
				price_aux_limit: '0.00000000',
				type_prev: null,
				tif: '3570',
				v_pair: 'ETHUSD',
				meta: { $F15: 1, auth: '0x97ebb3391b30f495ce8cb97857db9b72d3e9dbcb' },
				symbol: 'tETHUSD',
				t: 1532375571000,
			},
			{
				_id: '5b56333fd952c07b351c593f',
				id: '1151079508',
				type: 'EXCHANGE LIMIT',
				pair: 'ETHUSD',
				status: 'CANCELED',
				created_at: '2018-07-21 16:15:53',
				updated_at: '2018-07-23 19:52:51',
				user_id: 5,
				amount: '-0.10000000',
				price: '10000.00000000',
				originalamount: '-0.10000000',
				routing: 'BFX',
				lockedperiod: 0,
				trailingprice: '0.00000000',
				hidden: 0,
				vir: 0,
				maxrate: '0.00000000000000000000',
				placed_id: null,
				placed_trades: null,
				nopayback: null,
				avg_price: '0.00000000000000000000',
				active: 0,
				fiat_currency: 'USD',
				cid: '58552546110',
				cid_date: '2018-07-21',
				mseq: '2',
				gid: null,
				flags: null,
				price_aux_limit: '0.00000000',
				type_prev: null,
				tif: '3570',
				v_pair: 'ETHUSD',
				meta: { $F15: 1, auth: '0x97ebb3391b30f495ce8cb97857db9b72d3e9dbcb' },
				symbol: 'tETHUSD',
				t: 1532375571000,
			},
		];

		const nonce = Date.now() / 1000 + 60 * 60 * 24 + '';
		const signature = await efx.sign(nonce.toString(16));

		nock('https://staging-api.deversifi.com/')
			.post('/v1/trading/r/getOrders/hist', body => {
				console.log('body: ', body);
				assert.equal(body.protocol, '0x');
				assert.ok(body.nonce);
				assert.ok(body.signature, signature);
				return true;
			})
			.reply(200, httpResponse);

		const response = await efx.getOrdersHist(null, nonce, signature);
		console.log('getOrderHist response: ', httpResponse);
		assert.deepEqual(response, httpResponse);
	});

	it('dvf client getUserconfig....', async () => {
		const apiResponse = {
			DVF: {
				exchangeSymbols: ['tETHUSD', 'tZRXUSD', 'tZRXETH'],
				exchangeAddress: '0xBd25cD867C304F079E696CBE44D958f3d3B683ba',
			},
			tokenRegistry: {
				ETH: {
					decimals: 18,
					minOrderSize: 0.1,
					starkTokenId: '0x1',
					starkVaultId: '0xa1',
				},
				USD: {
					decimals: 6,
					tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
					minOrderSize: 25,
					settleSpread: -0.026,
					starkTokenId: '0x2',
					starkVaultId: '0xa2',
				},
				ZRX: {
					decimals: 18,
					tokenAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498',
					minOrderSize: 40,
					starkTokenId: '0x3',
					starkVaultId: '0xv1',
				},
			},
		};

		const nonce = Date.now() / 1000 + 60 * 60 * 24 + '';
		const signature = await efx.sign(nonce.toString(16));

		nock('https://staging-api.deversifi.com/')
			.post('/v1/trading/r/getUserConf', body => {
				console.log('body: ', body);
				assert.ok(body.nonce);
				assert.ok(body.signature, signature);
				return true;
			})
			.reply(200, apiResponse);

		const response = await efx.getUserConfig();
		console.log('getUserconfig response: ', apiResponse);
		assert.deepEqual(response, apiResponse);
	});
});
