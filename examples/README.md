To run the examples, you will need to set the following config variables:
1. `RPC_URL` : the RPC endpoint of an Ethereum node (ex: from https://infura.io)
2. `ETH_PRIVATE_KEY` : a private key of an Ethereum wallet with some ETH in it

These can be sat as environment variables or in a config.json file placed in
this directory.

You can use `00.setup.js` to create the `config.json` file, however since
the `RPC_URL` cannot be created pragmatically, you will first need to run
your own node or use a third-party RPC endpoint. https://ethereumico.io/knowledge-base/infura-api-key-guide

NOTE: the `API KEY` mentioned in the instructions has been renamed to `PROJECT ID`.

Once you obtain the `RPC_URL` you can then run:

```sh
node 00.setup.js <RPC_URL>
```

or simply

```sh
./00.setup.js <RPC_URL>
```

This will:
1. generate a new Ethereum wallet on 
2. pre-load it with Eth (at least 1 Eth)
3. save both the wallets private key and passed in `RPC_URL` into
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
RPC_URL=YOUR_NODE_OR_INFURA_URL ETH_PRIVATE_KEY=YORU_KEY ./01.register.js
```

You need to run `./01.register.js` exactly once before attempting any other
examples.

For the examples which required ether balance, you  will also need to call
`./02.deposit.js`.


## Editing or adding examples.

Example files in the [/examples](/examples) directory SHOULD NOT BE EDITED
BY HAND. Instead, they should be built with with [buildExamples](/examples/helpers/buildExamples.js) script.
The script uses the [helpers/examplesList.js](/examples/helpers/examplesList.js), [helpers/example.js.tmpl](/examples/helpers/example.js.tmpl) and files from [src](/examples/src) directory. For simple methods
which do not required arguments (or additional setup), including the name of the method
in [examplesList](/examples/helpers/examplesList.js) should be enough. For other
cases, a file named the same as the entry in [examplesList](/examples/helpers/examplesList.js)
can be placed in [src](/examples/src), and the content of this file
will be spliced into the [example.js.tmpl](/examples/helpers/example.js.tmpl)
(in place of `{{{EXAMPLE_SRC}}}`).
