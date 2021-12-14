<img src="https://avatars1.githubusercontent.com/u/56512535?s=200&v=4" align="right" />

# Deversifi Javascript Trading API

A js client library for DeversiFi - StarkWare orders

**Note:** This library is for DeversiFi. A test version of the platform to use during integrations is connected to the Ropsten test network at https://app.stg.deversifi.com // https://api.stg.deversifi.com

## Contents

- [Installation](#installation)
    - [NPM](#npm)
    - [Prebuild for browser](#prebuild-for-browser)
- [Setup](#setup)
    - [Pre Requisites](#pre-requisites)
    - [Instancing](#instancing)
        - [Using MetaMask or a local node](#using-metamask-or-a-local-node)
        - [Using a private key](#using-a-private-key)
        - [Configuration](#configuration)
- [API Authentication](#api-authentication)
- [Registering](#registering)
- [Approving tokens](#approving-tokens)
- [Depositing tokens](#depositing-tokens)
- [Placing an order](#placing-an-order)
- [Withdrawing tokens](#withdrawing-tokens)
    - [Requesting a withdrawal](#requesting-a-withdrawal)
    - [Withdraw on chain](#withdraw-on-chain)
- [Cancelling Orders](#cancelling-orders)
- [Authenticated data endpoints](#authenticated-data-endpoints)
- [More examples](#more-examples)
    - [Gas Price](#gas-price)
    - [Custom order ID](#custom-order-id)
- [Troubleshooting](#troubleshooting)
- [Developing](#developing)
    - [Setup](#setup-1)
    - [Implementing-a-new-future](#implementing-a-new-feature)
- [Useful Links](#links)
- [Developing](#developing)


## Installation

### NPM

```bash
  npm i dvf-client-js
```
### Prebuild for browser

Alternatively on the browser you can use the standalone build
```html
<script src="http://path/to/dist/dvf.js"></script>
```

## Setup

### Pre Requisites

  - An Ethereum wallet
  - A web3 provider with your account or a private key
    * Such as MetaMask, keystore file, hardware wallet or raw private key

### Instancing

#### Using MetaMask or a local node

```javascript
// In case of MetaMask make sure you call ethereum.enable() before using it
const DVF = require('dvf-client-js')
const dvf = await DVF()
```

#### Using a private key

````javascript
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("Web3")

const privateKey = '8F085...' // Account's private key
const rpcUrl = 'https://mainnet.infura.io/v3/9e28b...'

const provider = new HDWalletProvider(privateKey, rpcUrl)
const web3 = new Web3(provider)

dvf = await DVF(web3)
````

View the full example: [/examples/node_sell_eth_infura.js](/examples/node_sell_eth_infura.js)

#### Configuration

It's possible to overwrite values on the configuration on a per instance basis.

The [default configuration](./src/config.js) can be overwritten with an optional
parameter `userConf` when calling the DVF function.

##### Parameters

- `api` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? (default `https://api.stg.deversifi.com`) API endpoint you are connecting to Staging (ropsten): https://api.stg.deversifi.com, Production (mainnet): https://api.deversifi.com)
- `gasApi` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? (default `https://ethgasstation.info`)
- `defaultGasLimit` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**? (default `200000`)
- `defaultGasPrice` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**? (default `50000000000`)
- `defaultStarkExpiry` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**? (default `720`) Expiration time for transfers and orders in hours
- `defaultNonceAge` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**? (default `43200`) Nonce age in seconds
- `defaultProvider` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? (default `http://localhost:8545`) In case no web3 provider is provided we will try connecting to this default
- `autoLoadUserConf` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**? - Enables integrators to select if they want to call `getUserConfig` upon initialization
- `autoLoadExchangeConf` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**? - Enables integrators to select if they want to call `getConfig` upon initialization

For instance:

```javascript
  dvf = await DVF(web3, {
    api: 'https://your-custom-api-address',
    gasStationApiKey: 'a1b2c3...
  })
```

The configuration is also merged with the configuration provided by the exchange
on the HTTP endpoint `/v1/trading/r/getConf` which at the moment looks similar
to this:

```json
{
   "DVF":{
      "defaultFeeRate":0.002,
      "deversifiAddress":"0xaf8ae6955d07776ab690e565ba6fbc79b8de3a5d",
      "starkExContractAddress":"0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b",
      "withdrawalBalanceReaderContractAddress":"0x650ca2dca7e2e2c8be3bb84e0a39dd77891d4d1e",
      "exchangeSymbols":[
         "ETH:USDT",
         "MKR:ETH",
         "MKR:USDT"
      ],
      "tempStarkVaultId":1,
      "minDepositUSDT":1
   },
   "tokenRegistry":{
      "ETH":{
         "decimals":18,
         "quantization":10000000000,
         "minOrderSize":0.05,
         "starkTokenId":"0xb333e3142fe16b78628f19bb15afddaef437e72d6d7f5c6c20c6801a27fba6"
      },
      "MKR":{
         "decimals":18,
         "quantization":10000000000,
         "minOrderSize":0.025,
         "tokenAddressPerChain": {
            "ETHEREUM": "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
         },
         "starkTokenId":"0x1a4af39d27ce2e3445ed084809e5bc36d03918df04b7e2b6ee3c769a9892600"
      }
   }
}
```

The complete compiled configuration is accessible through `dvf.config`, for instance:

```javascript
const dvf = await DVF()

const config = dvf.config
```

### API Authentication

Authentication to make all authenticated requests is done by signing a `nonce` using an
Ethereum private key. Signing is handled by the Deversifi client
library if the account is available and unlocked or if the web3 provider supports it.
Otherwise the message and signature need to be prepared separately.

##### Parameters
- `nonce` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Nonce which is used to provide the time until which this nonce is valid. It is presented as seconds since epoch.
- `signature` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The signature obtained by signing the nonce with your private ethereum key.

```javascript
const nonce = (Date.now() / 1000).toString()
const signature = await dvf.sign(nonce)
```

### Registering
This method is used to register a stark public key that corresponds to an Ethereum public address or a trading key.


##### Parameters
- `starkPublicKey` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    - `x` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** - First 32 bits of stark public key
- `nonce` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Nonce which is used to provide the time until which this nonce is valid. It is presented as seconds since epoch.
- `signature` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The signature obtained by signing the nonce with your private ethereum key.
- `contractWalletAddress` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? Address of the deployed contract wallet (only for contract wallet integrations)

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[UserConfigResponse](https://docs.deversifi.com/docs#postV1TradingRGetuserconf)>**  

### Approving Tokens

When depositing an ERC20 Ethereum-based token for the first time from a specific account,
you are required to approve it to interact with the smart contracts, this is not required for ETH.

##### Parameters
- `token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Token symbol that's available in `dvf.config.tokenRegistry`

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[PromiEvent](https://web3js.readthedocs.io/en/v1.2.11/callbacks-promises-events.html#promievent)>** 

```javascript
const token = 'ETH'
await dvf.contract.approve(token)
```

This step does not need to be repeated again, and subsequently you are required
only to call the deposit function.

### Depositing tokens
This method is used to deposit the tokens to the smart contract and submit a signed notification of a new deposit made to the API.
                                                                    
##### Parameters
- `token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Token symbol available in `dvf.config.tokenRegistry` to be deposited
- `amount` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** || **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Amount of tokens to be deposited
- `starkPrivateKey` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Trading key
- `nonce` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? Nonce which is used to provide the time until which this nonce is valid. It is presented as seconds since epoch.
- `signature` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? The signature obtained by signing the nonce with your private ethereum key.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;{...[PromiEvent](https://web3js.readthedocs.io/en/v1.2.11/callbacks-promises-events.html#promievent), ...[DepositResponse](https://docs.deversifi.com/docs#postV1TradingWDeposit)}>**

```javascript
const token = 'ETH'
const amount = 100

const deposit = await dvf.deposit(token, amount, tradingKey)
```

### Placing an order

This authenticated endpoint is used to place an order.

##### Parameters
- `symbol` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Pair which you wish to trade
- `amount` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** || **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Order amount specified in the first currency in the symbol (i.e. ZRXETH). For a sell, amount is negative. Amount accepts either maximum 8 d.p, or as many decimals as are available on the relevant token's smart contract if it is fewer than 8.
- `price` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** || **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Order price  specified in the second currency in the symbol (i.e. ZRXETH). Prices should be specified to 5 s.f. maximum.
- `nonce` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? Nonce which is used to provide the time until which this nonce is valid. It is presented as seconds since epoch.
- `signature` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? The signature obtained by signing the nonce with your private ethereum key.
- `starkPrivateKey` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? Trading key (for keystore etc.)
- `ledgerPath` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? Ledger derivation path if using ledger
- `isPostOnly` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Flag to indicate if the order is post-only.      
- `isHidden` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Flag to indicate if the order is hidden.      
- `validFor` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**? Validation time in hours
- `feeRate` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**? Fee rate if known
- `cid` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? Optional custom order ID that could be set when placing order and used later to retrieve order. This ID is unique per user (user A and B can each have an order with `cid = AAA`, but the same user cannot have two orders with the same `cid`). [See example](#custom-order-id)
- `gid` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**?      
- `partnerId` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**?      
- `ethAddress` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**?      
- `type` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? Order type (`EXCHANGE LIMIT`, `EXCHANGE MARKET`)
- `protocol` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? (default `stark`)


Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[SubmitOrderResponse](https://docs.deversifi.com/docs#postV1TradingWSubmitorder)>**

```javascript
const symbol = 'NEC:ETH'
const amount = -15
const price = 0.0025

const orderId = await dvf.submitOrder(symbol, amount, price)
```

### Getting Orders
This method allows you to get a specific order by `orderId` or `cid`.

##### Parameters
- `orderId` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? ID of the order
- `nonce` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? Nonce which is used to provide the time until which this nonce is valid. It is presented as seconds since epoch.
- `signature` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? The signature obtained by signing the nonce with your private ethereum key.
- `cid` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? If order was placed with custom order ID (`cid`) property set, it can be canceled using same `cid`.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[CancelOrderResponse](https://docs.deversifi.com/docs#postV1TradingWCancelorder)>**

```javascript
const orderID = '123'
const customID = 'cid-123'

const order = await dvf.getOrder({ orderId: orderID })
// or
const order = await dvf.getOrder({ cid: customID })
```


### Cancelling Orders
This method allows you to cancel a specific order by `orderId` or `cid`.

##### Parameters
- `orderId` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** ID of the order
- `nonce` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? Nonce which is used to provide the time until which this nonce is valid. It is presented as seconds since epoch.
- `signature` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? The signature obtained by signing the nonce with your private ethereum key.
- `cid` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? If order was placed with custom order ID (`cid`) property set, it can be canceled using same `cid`.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[CancelOrderResponse](https://docs.deversifi.com/docs#postV1TradingWCancelorder)>**

```javascript
const orderID = '123'
const customID = 'cid-123'

const response = await dvf.cancelOrder({ orderId: orderID })
// or
const response = await dvf.cancelOrder({ cid: customID })
```

### Withdrawing tokens
#### Requesting a withdrawal
This method submits a request for a new withdrawal.
##### Parameters
- `recipientEthAddress` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Trading key
- `token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Token symbol available in `dvf.config.tokenRegistry` to be withdrawn
- `amount` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** || **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Amount of tokens to be withdrawn

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[WithdrawResponse](https://docs.deversifi.com/docs#postV1TradingWWithdraw)>**

```javascript
const token = 'ETH'
const amount = 100
const withdrawal = await await dvf.transferAndWithdraw({
  recipientEthAddress: address,
  token,
  amount
})
```

#### Withdraw on chain
This method calls the contract and withdraws the tokens to your wallet
##### Parameters
- `token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Token symbol available in `dvf.config.tokenRegistry` to be withdrawn

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;{ transactionHash: **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** }>**             

```javascript
const token = 'ETH'
const txHash = await dvf.withdrawOnchain(token)
```

### Authenticated data endpoints

If you already have an unlocked wallet available to web3 to use for signing,
you can simply get data from the API as follows:

Note: You should reuse the `nonce` and `signature` and pass them to these methods while they are valid to avoid unnecessary signing

##### Parameters
- `nonce` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? Nonce which is used to provide the time until which this nonce is valid. It is presented as seconds since epoch.
- `signature` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**? The signature obtained by signing the nonce with your private ethereum key.

```javascript
// Get all open orders
const openOrders = await dvf.getOrders()

// Get all historical orders
const historicalOrders = await dvf.getOrdersHist()

// Get specific order 
const id = "123"
const order = await dvf.getOrder(id)

// Get exchange balances
const balance = await dvf.getBalance()

// Get deposits
const deposits = await dvf.getDeposits()

// Get withdrawals 
const withdrawals = await dvf.getWithdrawals()

// Get user config
const userConfig = await dvf.getUserConfig()
```

## More Examples

Aside from these examples, there are complete examples in the [examples folder](./examples)

### Gas Price

You can setup a default custom gas price by setting up the 'defaultGasPrice' property
```javascript
const dvf = await DVF()

dvf.set('defaultGasPrice', web3.utils.toWei('2', 'gwei'))

```
DVF Client calls https://ethgasstation.info API to get the current gas prices and calculate a safe gas price for Ethereum transactions. Access to the ETH Gas Station API is free, but rate limited if you are not using an API key. If a ETH Gas Station API key is not provided then a recommended gas price is used which is available in `dvf.recommendedGasPrices`.

To configure your api key with dvf client please pass this as a `userConf` parameter when initialising DVF:

```
javascript
  dvf = await DVF(web3, {
    gasStationApiKey: 'a1b2c3...'
  })
```
or by setting the 'gasStationApiKey' property:

```javascript

dvf.set('gasStationApiKey', 'a1b2c3...')

```
### Custom order ID
Property `cid` can be used to give order custom identificator for further tracking.

```js
const symbol = 'ETH:USDT'
const amount = -1.42
const price = 3000

const customOrderID = `short-` + Math.random().toString(36).substring(7)

await dvf.submitOrder({
  symbol, 
  amount, 
  price,
  cid: customOrderID,
})

// ...
// Later we can use `cid` to get order
const order = await dvf.getOrder({cid: customOrderID})

// or cancel it
await dvf.cancelOrder({cid: customOrderID})
```

## Troubleshooting

A list of error codes returned by the API and reasons are available [here](./src/lib/dvf/errorReasons.js#L1).
Some more detailed explanations can also be found in the [API Documentation](https://docs.deversifi.com).

If you have suggestions to improve this guide or any of the available
documentation, please raise an issue on Github, or email [feedback@Deversifi.com](mailto:feedback@Deversifi.com).

## Links

 - [API documentation](https://docs.deversifi.com)

## Developing

### Setup

 - `git clone`
 - `npm install`

### Implementing a new feature

Starting by watching the test files ( you will need a node running )

```bash
$ npm run test:watch
```

 - Write the tests for your new features on the `./test/`
 - Add your tests to './test/index.js' file if necessary
 - Create your features on ./src/ folder

 * _You will need a ropsten node to do blockchain related tests_

### Testing

#### On node.js

```bash
$ npm run test
```

#### On a headless browser ( using browserify and mochify )

```bash
$ npm run test:web
```

#### Manually on your browser on a browser console

  - Very useful in case you want to issue commands from Google Chrome
  while using MetaMask !

```bash
$ npm run build:web:run
```

  - Open your browser on [http://localhost:2222](http://localhost:2222)

### Building for browsers

  - This will build the whole library as one big ugly standalone js file ( uses browserify )

```bash
$ npm run build
```

## License

MIT
