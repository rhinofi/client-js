# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
