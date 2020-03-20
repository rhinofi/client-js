const Transport = require('@ledgerhq/hw-transport-node-hid').default
const Eth = require('@ledgerhq/hw-app-eth').default

module.exports = (
  path, // string a path in BIP 32 format
  transferTokenAddress, // string?
  transferQuantization, // BigNumber quantization used for the token to be transferred
  sourceVault, // number ID of the source vault
  destinationVault, // number ID of the destination vault
  amountTransfer, // BigNumber amount to transfer
  nonce, // number transaction nonce
  timestamp // number transaction validity timestamp
) => {

  const transport = await Transport.open()
  const eth = new Eth(transport)
  const starkKey = await eth.starkGetPublicKey(path)
  //console.log({ starkKey })
  
  const starkSignature = await eth.starkSignTransfer(
    path,
    transferTokenAddress.substr(2),
    transferQuantization,
    starkKey,
    sourceVault,
    destinationVault,
    amountTransfer,
    nonce,
    timestamp
  )

  return { starkKey, starkSignature }
}
