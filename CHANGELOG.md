# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## 5.0.0 - 2023-01-07
### Changed
- rename from dvf-client-js to @rhino.fi/client-js
- rename entry point from src/dvf to src/index
- remove references to dvf from README and examples

## 4.2.0 - 2023-01-06
### Changed
- Add new methods
- Use yarn berry
- Update\cleanup README.md
- Update node deps
- Add shell.nix etc

## 4.1.0 - 2022-06-30
### Changed
- Support fee on transferAndWithdraw

## 4.0.0 - 2022-06-15
### Changed
- StarkEx v3 compatibility removed along with onchain registration functions

## 3.1.9 - 2021-05-16
### Changed
- EIP712 signature helper for ledger devices

## 3.1.8 - 2021-04-12
### Changed
- Add slippage reduction for funding stark orders

## 3.1.7 - 2021-01-15
### Changed
- Store input "web3" as both ETHEREUM and DEFAULT web3 provider when not specified

## 3.1.6 - 2021-01-12
### Changed
- Update bridge contract addresses conf location

## 3.1.5 - 2021-01-07
### Changed
- Update `withdrawOnChain` example for StarkEx V4

## 3.1.3 - 2021-11-15
### Changed
- Add getAmmFundingOrder method to track AMM operations

## 3.1.2 - 2021-11-10
### Changed
- Add poolTvlHistory endpoint

## 3.1.1 - 2021-11-10
### Changed
- When user denies register TX, respond with more friendly message

## 3.1.0 - 2021-11-04
### Changed
- Assuming default web3 provider is an Ethereum mainnet or testnet
- `useAuthHeader` authentication mode for all examples

## 3.0.3 - 2021-10-22
### Changed
- Add manual xDVF support

## 3.0.2 - 2021-09-24
### Changed
- Fixed issue preventing native tokens to be deposited from sidechains

## 3.0.1 - 2021-10-06
### Changed
- Updated Ledger data provision for Goerli test tokens (USDT, WBTC, DVF, xDVF)

## 3.0.0 - 2021-09-21
### Changed
- Using RPC_URL instead of INFURA_PROJECT_ID in config for more flexibility

## 2.8.3 - 2021-09-16
### Changed
- Update feeRate check on order payload creation to replace feeRate only if not present and preserve falsy values like 0 to allow staking

## 2.8.2 - 2021-08-02
### Changed
- Bridged deposit to call deposit validation endpoint for sanity checks

## 2.8.1 - 2021-07-14
### Changed
- Fixed issues causing Ledger transactions to require reload after error

## 2.8.0 - 2021-07-09
### Changed
- Adding DVF token metadata for Ledger compatibility

## 2.7.0 - 2021-06-30
### Changed
- Support of multiple web3 providers passed in the constructor

## 2.6.0 - 2021-06-17
### Changed
- Add `bridgedDeposit` and `bridgedWithdraw` methods

## 2.5.2 - 2021-06-11
### Changed
- Use GET method when getting gas price from API in `getGasPrice`

## 2.5.1 - 2021-06-09
### Changed
- Add optional `memo` to transfer API

## 2.5.0 - 2021-06-7
### Changed
- Adding optional `permitParams` argument to `depositV2` and `registerAndDeposit` (will try to use signature-based eip-2612 permit instead of `approve` if passed)

## 2.4.0 - 2021-06-4
### Changed
- Accomodating changes in configuration tokenRegistry structure (`tokenAddressPerChain`)
- `dvf.approve` to accept an extra argument `chain` (defaults to `'ETHEREUM'`)
- accept transaction hash callback option when doing token approval, deposit and register + deposit

## 2.3.0 - 2021-05-25
### Changed
- `dvf.depositV2` and `dvf.registerAndDeposit` to accept optional `web3Options` parameter for internal use (better gas limit estimates)

## 2.2.0 - 2021-05-10
### Changed
- `dvf.getFeeRate` to accept `symbol` and `feature` parameters

## 2.1.4 - 2021-04-26
### Changed
- Public user permissioning added to the client

## 2.1.3 - 2021-16-04
### Added
- `dvf.getMinMaxOrderSize` to get order size limitations by `symbol`

## 2.1.2 - 2021-04-16
### Changed
- `dvf.register` and `dvf.registerAndDeposit` to accept an optional `meta` parameter for interal use

## 2.1.1 - 2021-04-09
### Changed
- Exposing `dvf.getAuthenticated` for arbitrary calls to GET endpoints
- Allowing custom headers in `dvf.getAuthenticated`

## 2.1.0 - 2021-03-31
### Added
- `dvf.getRegistrationStatuses` endpoint for checking both Deversifi and on-chain registration statuses - see `examples/29.getRegistrationStatuses.js`

## 2.0.1 - 2021-03-30
### Fixed
- Schema validated using `validateWithJoi` to be `required()` by default

## 2.0.0 - 2021-03-30
### Changed
- `dvf.transfer` method signature changes : `starkPrivateKey` to be set via configuration instead of input argument - see `examples/27.transfer.js`
- Updated examples

## 1.0.6 - 2020-07-08
### Fixed
- Handle errors in getConfig during initialisation

## 1.0.5 - 2020-07-02
### Added
- Use dvf pub api to get range of gas prices

## 1.0.4 - 2020-07-01
### Added
- gas Station API optional
- Use recommended gas price from config

## 1.0.3 - 2020-06-26
### Added
- Use Deversifi Symbol format in config file

## 1.0.2 - 2020-06-25
### Added
- Use API Key for eth gas station api call

## 1.0.1 - 2020-06-24
### Fixed
- web3 provider calls for blocknumber
