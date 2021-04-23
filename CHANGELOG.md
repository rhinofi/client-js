# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.1.3 - 2021-16-04
### Added
- `dvf.getMinMaxOrderSize` to get order size limitations by `symbol`

## 2.1.2 - 2021-16-04
### Changed
- `dvf.register` and `dvf.registerAndDeposit` to accept an optional `meta` parameter for interal use

## 2.1.1 - 2021-09-04
### Changed
- Exposing `dvf.getAuthenticated` for arbitrary calls to GET endpoints
- Allowing custom headers in `dvf.getAuthenticated`

## 2.1.0 - 2021-31-03
### Added
- `dvf.getRegistrationStatuses` endpoint for checking both Deversifi and on-chain registration statuses - see `examples/29.getRegistrationStatuses.js`

## 2.0.1 - 2021-30-03
### Fixed
- Schema validated using `validateWithJoi` to be `required()` by default

## 2.0.0 - 2021-30-03
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
