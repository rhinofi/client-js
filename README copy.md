<img src="https://avatars3.githubusercontent.com/u/33315316?s=200&v=4" align="right" />

# Ethfinex Trading API for Node.JS

A Node.JS client for Ethfinex API

- [Installation](#installation)
    - [NPM](#npm)
    - [Prebuild for browser](#prebuild-for-browser)
- [Setup](#setup)
    - [Authentication](#authentication)
    - [Pre Requisites](#pre-requisites)
    - [Instancing](#instancing)
        - [Using MetaMask or a local node](#using-metamask-or-a-local-node)
        - [Using a remote node](#using-a-remote-node)
        - [Using Infura](#using-infura)
        - [Configuration](#configuration)
        - [Gas Price](#gas-price)
- [Placing an Order](#placing-an-order)
    - [Approving tokens](#approving-tokens)
    - [Locking tokens](#locking-tokens)
    - [Submitting an order](#submitting-an-order)
    - [Tether market shift](#tether-market-shift)
- [Cancelling Orders](#cancelling-orders)
    - [Standard cancel](#standard-cancel)
    - [Signing externally](#signing-externally)
- [Account History](#account-history)
- [Unlocking Tokens](#unlocking-tokens)
- [More examples](#more-examples)
    - [Submitting a buy order](#submitting-a-buy-order)
    - [Submitting a sell order](#submitting-a-sell-order)
    - [Fetching info about specific order](#fetchin-info-about-specific-order)
- [Troubleshooting](#troubleshooting)
- [Developing](#developing)
    - [Setup](#setup-1)
    - [Run a node](#run-a-node)
    - [Implementing-a-new-future](#implementing-a-new-feature)
- [Useful Links](#links)
- [Developing](#developing)


## Installation

### NPM

```bash
  npm i efx-api-node
```
### Prebuild for browser

Alternatively on the browser you can use the standalone build
```html
<script src="http://path/to/dist/efx.js"></script>
```

## Setup

### Authentication

Authentication to make all the following requests is done by signing using an
Ethereum private key. Signing is handled by the Ethfinex Trustless client
library if the account is available and unlocked. However if signing using
a hardware wallet, or using a raw private key, the message and signature need
to be prepared separately.

### Pre Requisites

  - An ethereum wallet
  - A web3 provider with your account or a private key
    * Such as MetaMask, keystore file, hardware wallet or raw private key

### Instancing

#### Using MetaMask or a local node

```javascript

// In case of MetaMask make sure you call ethereum.enable() before using it
const EFX = require('efx-api-node')
const efx = await EFX()
```

#### Using a remote node

```javascript
const EFX = require('efx-api-node')
const web3 = new EFX.Web3("https://your-web3-provider")
const efx = await EFX(web3)
```

#### Using Infura


````javascript
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("Web3")

const privateKey = '8F085...' // Account's private key
const infuraKey = '9e28b...'  // Your Infura API KEY
const infuraURL = 'https://mainnet.infura.io/v3/' + infuraKey

const provider = new HDWalletProvider(privateKey, infuraURL)
const web3 = new Web3(provider)

efx = await EFX(web3)
````

View the full example: [/examples/node_sell_eth_infura.js](/examples/node_sell_eth_infura.js)

#### Configuration

It's possible to overwrite values on the configuration on a per instance basis.

The [default configuration](./src/config.js) can be overwriten with an optional
parameter `userConf` when calling the EFX function.

For instance:

```javascript
  efx = await EFX(web3, {
    api: 'https://your-custom-api-address'
  })
```

The configuration is also merged with the configuration provided by the exchange
on the HTTP endpoint `/trustless/v1/r/get/conf` which at the moment looks similar
to this:

```json
"0x":{
    "minOrderTime":300,
    "tokenRegistry":{
      "ETH":{
          "decimals":18,
          "wrapperAddress":"0x965808e7f815cfffd4c018ef2ba4c5a65eba087e",
          "minOrderSize":0.02
      },
      "USD":{
          "decimals":6,
          "wrapperAddress":"0x83e42e6d1ac009285376340ef64bac1c7d106c89",
          "tokenAddress":"0x0736d0c130b2ead47476cc262dbed90d7c4eeabd",
          "minOrderSize":10,
          "settleSpread": 0.002
      }
    },
    "ethfinexAddress":"0x9faf5515f177f3a8a845d48c19032b33cc54c09c",
    "exchangeAddress":"0x67799a5e640bc64ca24d3e6813842754e546d7b1",
    "exchangeSymbols":[
      "tETHUSD"
    ]
}
```

The complete compiled configuration is accessible through `efx.config`, for instance:

```javascript
const efx = await EFX()

const config = efx.config
```

#### Gas Price

You can setup a custom gas price by setting up the 'gasPrice' property
```javascript
const efx = await EFX()

efx.set('gasPrice', web3.utils.toWei('2', 'gwei'))

```

### Placing an Order

Before placing an order, you are required to lock tokens into the Ethfinex wrapper
contracts. This allows for guaranteed execution and ensures Trustless orders
can be added directly onto the centralised order book, and matched against
trades from centralised users.

### Approving Tokens


The first time locking an ERC20 Ethereum-based token from a specific account,
you are required to approve it to interact with the time-lock smart contracts.

```javascript
const token = 'ZRX'
efx.contract.approve(token)
```

This step does not need to be repeated again, and subsequently you are required
only to call the lock function. This transfers tokens into the wrapper token
contract, ready to trade.


### Locking tokens

```javascript
const token = 'ZRX'
const amount = 15 // Number of tokens to lock
const forTime = 48 // Time after which unlocking does not require permission

const response = await efx.contract.lock(token, amount, forTime)
```

The time limit specified when locking is a maximum - tokens can always be
unlocked after this time limit (in hours) expires. In order to unlock tokens
before this expires, you must request a signed permission from Ethfinex.

This is always returned if you have no orders open involving those tokens.

### Submitting an order


```javascript
const symbol = 'ZRXETH'
const amount = -15
const price = 0.0025

const orderId = await efx.submitOrder(symbol, amount, price)
```

Orders are generated and submitted, returning either an `orderId` or error. A
full list of possible errors and their associated explanation is available [here](https://docs.ethfinex.com/?version=latest#troubleshooting).

When submitting this order we use the 3 first parameters:

 - `symbol` is the pair which you wish to trade
 - `amount` is specified in the first currency in the symbol (i.e. ZRXETH). For a
sell, amount is negative. Amount accepts either maximum 8 d.p, or as many
decimals as are available on the relevant token's smart contract if it is
fewer than 8.
 - `price` is specified in the second currency in the symbol (i.e. ZRXETH). Prices
should be specified to 5 s.f. maximum.

**Warning:** Trustless orders will always be settled at the **exact price you specify**, and can never be adjusted by Ethfinex, **even if it is at a worse price than the market**.

For example, when placing a sell order, if the `price` specified is below the highest bid available on the order book, the order will be executed instantly at market. However, the amount you receive will reflect only the `price` that you entered, and not the market price at the time of execution.

The client library also provides methods for [submitBuyOrder](./src/api/submit_buy_order.js)
and [submitSellOrder](./src/api/submit_sell_order.js).

You can additionally provide

 - `gid` - Group ID for your order
 - `cid` - Client order ID
 - `signedOrder` - A previously signed order, in case you're handling signing
 - `validFor` - optional amount of hours this order will be valid for, default
 to 3600 seconds as specified [on the default configuration](./src/config.js#L5)

### Tether market shift

The XXX/**USDT** markets on Trustless build on the liquidity of XXX/**USD** markets on the
centralised exchanges of Bitfinex and Ethfinex. However since there is often not a
direct 1:1 rate between USD and USDT, a shift must be applied to the order books.

The configuration for Trustless returns a `settleSpread` parameter:

```json
      "USD":{
          "decimals":6,
          "wrapperAddress":"0x83e42e6d1ac009285376340ef64bac1c7d106c89",
          "tokenAddress":"0x0736d0c130b2ead47476cc262dbed90d7c4eeabd",
          "minOrderSize":10,
          "settleSpread": 0.02
      }
```

This `settleSpread` is indicative of the current USDT/USD exchange rate. When orders are placed
on USDT markets, the settlement price in the signed order must be shifted by the `settleSpread`
parameter before the order is accepted.

For example, if placing a buy order on the ETH/USD(T) market at a price of 100 USD relative to the centralised exchange the order will be settled on Trustless at a price of 102 USDT.
Equally a sell order at 100 USD would receive 102 USDT when settled on Trustless.

```javascript
efx.submitOrder(symbol, amount, price) // => settlementPrice = price * (1 + settleSpread)
```
The `settleSpread` parameter is set dynamically as a 30 minute rolling mean of the USDT/USD
market exchange rate. When placing orders using `submitOrder` or generating them with
`createOrder` the shift is applied for you.


### Cancelling Orders
Cancelling orders requires the `orderId` you wish to cancel to be signed by the
address which created and placed the order.

#### Standard Cancel

In case you're not signing the requests yourself

```javascript
await efx.cancelOrder(orderId)
```

#### Signing Externally

In case you're signing the requests yourself:

```javascript
const sig = await efx.sign(parseInt(orderId).toString(16))
const sigConcat = ethUtils.toRpcSig(sig.v, ethUtils.toBuffer(sig.r), ethUtils.toBuffer(sig.s))

await efx.cancelOrder(parseInt(orderId), sigConcat)
```

### Account History

If you already have an unlocked wallet available to web3 to use for signing,
you can simply get open orders and order history from the API as follows:

```javascript
// Get all open orders
const openOrders = await efx.getOrders()

// Get all historical orders
const historicalOrders = await efx.getOrdersHist()
```

If an unlocked account is not available to sign with, for example when using a
raw private key or hardware wallet, authentication `nonce` and `signature` must be
pre-signed and passed into the calls. `nonce` is required to be a timestamp less
than 3 hours in the future. `signature` is the `nonce` signed using the relevant
private key for the address who's orders you wish to view.

```javascript
const ethUtils = require('ethereumjs-utils')

const privKey = /* Your Private Key */
const nonce = ((Date.now() / 1000) + 10800) + ''

const hash = ethUtils.hashPersonalMessage(ethUtils.toBuffer(nonce.toString(16)))
const signature = ethUtils.ecsign(hash, privKey)

// Get all open orders
const openOrders = await efx.getOrders(null, null, nonce, signature)

// Get all historical orders
const historicalOrders = await efx.getOrdersHist(null, null, nonce, signature)
```

### Unlocking tokens

If tokens are not used in active orders they can always be unlocked. If
unlocking after the time specified when locking has expired, no permission is
required. When unlocking before this, Ethfinex must sign a release permission,
after verifying that you have no orders currently active which require that token.

If you need permission the library will [automatically call the expected endpoint](./src/api/contract/unlock.js#L24)
on Ethfinex API to ask for such permission.

```javascript
const token = 'ZRX'
const amount = 15
const response = await efx.contract.unlock(token, amount)
```

When a particular token's lock time has not yet expired, permission is required
from Ethfinex to unlock early. This permission can be requested directly from
Ethfinex using an API call.

The request must be authenticated using a nonce and signature, and the response
contains a signed permission from Ethfinex. This permission will always be
granted if Ethfinex is online and your address has no open orders involving
those tokens. In case you're signing the requests yourself you could use the
following code:

```javascript
// This example shows how to generate the signature from a raw private key
// Signing using hardware wallets such as Ledger or Trezor can be done using their documentation

const ethUtils = require('ethereumjs-utils')

const privKey = /* Your Private Key */
const nonce = ((Date.now() / 1000) + 350) + ''

const hash = ethUtils.hashPersonalMessage(ethUtils.toBuffer(nonce.toString(16)))
const signature = ethUtils.ecsign(hash, privKey)

const response = await efx.contract.unlock(token, amount, nonce, signature)

```




```js

const token = 'ZRX'
const amount = 0.001

const response = await efx.contract.unlock(token, amount, forTime)

```

## More Examples

  Aside from these examples, there are complete examples in the [examples folder](./src/examples)
### Submitting a buy order

```js

const symbol = 'ETHUSD'
const amount = 1
const price = 100

efx.submitOrder(symbol, amount, price)

```

### Submitting a sell order

```js

const symbol = 'ETHUSD'
const amount = -1
const price = 100

const orderId = await efx.submitOrder(symbol, amount, price)

```

### Fetching info about specific order

```js

const id = 1

const order = await efx.getOrder(id)

```

## Troubleshooting

A list of error codes returned by the API and reasons are available [here](./src/lib/error/reasons.js#L1).
Some more detailed explanations can also be found in the [API Documentation](https://docs.ethfinex.com).

If you have suggestions to improve this guide or any of the available
documentation, please raise an issue on Github, or email [feedback@ethfinex.com](mailto:feedback@ethfinex.com).

## Links

 - [API documentation](https://docs.ethfinex.com)
 - [Ethfinex trustless developer guide](https://blog.ethfinex.com/ethfinex-trustless-developer-guide/)

## Developing

### Setup

 - `git clone`
 - `npm install`
 - `bash <(curl https://get.parity.io -L) # install parity`

### Run a node

On kovan:

```bash
parity --chain kovan --jsonrpc-apis=all --geth
```
* note the jsonrpc set to all
* note the `--geth` in order to be compatible with `geth`'s unlock 'duration' parameter

On ropsten:
```bash
geth --testnet --fast --bootnodes "enode://20c9ad97c081d63397d7b685a412227a40e23c8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e6a8866ad7f0e17c02b14182d37ea7c3c8b9c2683aeb6b733a1@52.169.14.227:30303,enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303" --rpc --rpccorsdomain "*" --rpcapi "eth,web3,personal,net"
```

Alternatively, thanks to [ganache-cli](https://github.com/trufflesuite/ganache-cli) we can
easily run an eth rpc node emulator. (NOTE: currently tests will fail using ganache)

```bash
npm test:rpc
```

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

### Building for browers

  - This will build the whole library as one big ugly standalone js file ( uses browserify )

```bash
$ npm run build
```


## TODO

 - Allow blockchain tests without relying on a local testnet node by using
 npm run test:rpc ( ganache ) and deploying mocked contracts at the beginning
 of the test.

 - Setup Travis-ci to test node.js, browser and standalone build. [see this page](https://blog.travis-ci.com/2017-09-12-build-stages-order-and-conditions)

## License

MIT
