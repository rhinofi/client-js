To run the examples, you will need to set the following config variables:
1. `INFURA_PROJECT_ID` : an PROJECT ID (formerly called API KEY) from https://infura.io
2. `ETH_PRIVATE_KEY` : a private key of an Ethereum wallet with some ETH in it
3. `ETH_GAS_STATION_KEY` : a API Key for from https://data.defipulse.com/ to be used for getting current gas price range from https://ethgasstation.info

These can be sat as environment variables or in a config.json file placed in
this directory.

You can use `00.setup.js` to create the `config.json` file, however since
the `INFURA_PROJECT_ID` cannot be created pragmatically, you will first need to
obtain it by following the 3 easy steps here: https://ethereumico.io/knowledge-base/infura-api-key-guide

NOTE: the `API KEY` mentioned in the instructions has been renamed to `PROJECT ID`.

For getting `ETH_GAS_STATION_KEY` register on https://data.defipulse.com/ 

Once you obtain the `INFURA_PROJECT_ID` and `ETH_GAS_STATION_KEY` you can then run:

```sh
node 00.setup.js YOUR_INFURA_PROJECT_ID ETH_GAS_STATION_KEY
```

or simply

```sh
./00.setup.js YOUR_INFURA_PROJECT_ID ETH_GAS_STATION_KEY
```

This will:
1. generate a new Ethereum wallet on ropsten
2. pre-load it with Eth (at least 1 Eth)
3. save both the wallets private key and passed in `INFURA_PROJECT_ID` as well as `ETH_GAS_STATION_KEY` into
   `./config.json` file in this directory.

NOTE:
All example files are marked as executables and contain a shebang line which
will caused them to be executed by node if called directly. Fox example the
following should work if you have previously ran the `./00.setup.js` script:

```sh
./01.register.js
```

or if you prefer, you can provide the required config vars on command line:

```sh
INFURA_PROJECT_ID=YOUR_ID ETH_PRIVATE_KEY=YORU_KEY ./01.register.js
```

You need to run `./01.register.js` exactly once before attempting any other
examples.

For the examples which required ether balance, you  will also need to call
`./02.deposit.js`.