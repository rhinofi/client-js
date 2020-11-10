<img src="https://avatars1.githubusercontent.com/u/56512535?s=200&v=4" align="right" />

# Deversifi Trading API for Node.JS

A js client library for DeversiFi - StarkWare orders

**Note:** This library is for DeversiFi. A test version of the platform to use during integrations is connected to the Ropsten test network at https://app.stg.deversifi.com // https://api.stg.deversifi.com

## Contents

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
  npm i dvf-client-js
```
### Prebuild for browser

Alternatively on the browser you can use the standalone build
```html
<script src="http://path/to/dist/dvf.js"></script>
```

## Setup

### Authentication

Authentication to make all the following requests is done by signing using an
Ethereum private key. Signing is handled by the Deversifi client
library if the account is available and unlocked. However if signing using
a hardware wallet, or using a raw private key, the message and signature need
to be prepared separately.

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

#### Using a remote node

```javascript
const DVF = require('dvf-client-js')
const web3 = new DVF.Web3("https://your-web3-provider")
const dvf = await DVF(web3)
```

#### Using Infura


````javascript
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("Web3")

const privateKey = '8F085...' // Account's private key
const infuraKey = '9e28b...'  // Your Infura API KEY
const infuraURL = 'https://mainnet.infura.io/v3/' + infuraKey

const provider = new HDWalletProvider(privateKey, infuraURL)
const web3 = new Web3(provider)

dvf = await DVF(web3)
````

View the full example: [/examples/node_sell_eth_infura.js](/examples/node_sell_eth_infura.js)

#### Configuration

It's possible to overwrite values on the configuration on a per instance basis.

The [default configuration](./src/config.js) can be overwritten with an optional
parameter `userConf` when calling the DVF function.

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
         "tokenAddress":"0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
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

#### Gas Price

You can setup a default custom gas price by setting up the 'defaultGasPrice' property
```javascript
const dvf = await DVF()

dvf.set('defaultGasPrice', web3.utils.toWei('2', 'gwei'))

```
DVF Client calls https://ethgasstation.info API to get the current gas prices and calculate a safe gas price for Ethereum transactions. Access to the ETH Gas Station API is free, but rate limited if you are not using an API key. If a ETH Gas Station API key is not provided then a recommended gas price is used which is available in `dvf.recommendedGasPrices`.

You can get an API Key from https://data.defipulse.com. To configure your api key with dvf client please pass this as a `userConf` parameter when initialising DVF:

```
javascript
  dvf = await DVF(web3, {
    api: 'https://your-custom-api-address',
    gasStationApiKey: 'a1b2c3...'
  })
```
or by setting the 'gasStationApiKey' property:

```javascript

dvf.set('gasStationApiKey', 'a1b2c3...')

```


### Approving Tokens

When depositing an ERC20 Ethereum-based token for the first time from a specific account,
you are required to approve it to interact with the time-lock smart contracts.

```javascript
const token = 'ZRX'
dvf.contract.approve(token)
```

This step does not need to be repeated again, and subsequently you are required
only to call the lock function. This transfers tokens into the wrapper token
contract, ready to trade.


### Submitting an order

```javascript
const symbol = 'ZRX:ETH'
const amount = -15
const price = 0.0025

const orderId = await dvf.submitOrder(symbol, amount, price)
```

Orders are generated and submitted, returning either an `orderId` or error. A
full list of possible errors and their associated explanation is available [here](https://docs.deversifi.com/?version=latest#troubleshooting).

When submitting this order we use the 3 first parameters:

 - `symbol` is the pair which you wish to trade
 - `amount` is specified in the first currency in the symbol (i.e. ZRXETH). For a
sell, amount is negative. Amount accepts either maximum 8 d.p, or as many
decimals as are available on the relevant token's smart contract if it is
fewer than 8.
 - `price` is specified in the second currency in the symbol (i.e. ZRXETH). Prices
should be specified to 5 s.f. maximum.

The client library also provides methods for [submitBuyOrder](./src/api/submitBuyOrder.js)
and [submitSellOrder](./src/api/submitSellOrder.js).


### Cancelling Orders
Cancelling orders requires the `orderId` you wish to cancel to be signed by the
address which created and placed the order.

#### Standard Cancel

In case you're not signing the requests yourself

```javascript
await dvf.cancelOrder(orderId)
```

#### Signing Externally

In case you're signing the requests yourself:

```javascript
const sig = await dvf.sign(parseInt(orderId).toString(16))
const sigConcat = ethUtils.toRpcSig(sig.v, ethUtils.toBuffer(sig.r), ethUtils.toBuffer(sig.s))

await dvf.cancelOrder(parseInt(orderId), sigConcat)
```

### Account History

If you already have an unlocked wallet available to web3 to use for signing,
you can simply get open orders and order history from the API as follows:

```javascript
// Get all open orders
const openOrders = await dvf.getOrders()

// Get all historical orders
const historicalOrders = await dvf.getOrdersHist()
```

If an unlocked account is not available to sign with, for example when using a
raw private key or hardware wallet, authentication `nonce` and `signature` must be
pre-signed and passed into the calls. `nonce` is required to be a timestamp less
than 3 hours in the future. `signature` is the `nonce` signed using the relevant
private key for the address who's orders you wish to view.

```javascript
const ethUtils = require('ethereumjs-utils')

const privKey = /* Your Private Key */
const nonce = ((Date.now() / 1000) + 43200) + ''

const hash = ethUtils.hashPersonalMessage(ethUtils.toBuffer(nonce.toString(16)))
const signature = ethUtils.ecsign(hash, privKey)

// Get all open orders
const openOrders = await dvf.getOrders(null, null, nonce, signature)

// Get all historical orders
const historicalOrders = await dvf.getOrdersHist(null, null, nonce, signature)
```

## More Examples

Aside from these examples, there are complete examples in the [examples folder](./examples)

### Submitting a buy order

```js
const symbol = 'ETH:USDT'
const amount = 1
const price = 100

dvf.submitOrder(symbol, amount, price)
```

### Submitting a sell order

```js
const symbol = 'ETH:USDT'
const amount = -1
const price = 100

const orderId = await dvf.submitOrder(symbol, amount, price)
```

### Fetching info about specific order

```js
const id = 1

const order = await dvf.getOrder(id)
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

### Building for browsers

  - This will build the whole library as one big ugly standalone js file ( uses browserify )

```bash
$ npm run build
```

## License

MIT
