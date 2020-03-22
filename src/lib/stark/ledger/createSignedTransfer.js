const Transport = require('@ledgerhq/hw-transport-node-hid').default
const Eth = require('@ledgerhq/hw-app-eth').default
const byContractAddress = require('@ledgerhq/hw-app-eth/erc20')
  .byContractAddress
const DVFError = require('../../dvf/DVFError')

module.exports = async (
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
  const starkKey = (await eth.starkGetPublicKey(path)).toString('hex')
  console.log({ transferTokenAddress })
  if (transferTokenAddress) {
    const tokenInfo = byContractAddress(transferTokenAddress)

    if (tokenInfo) {
      await eth.provideERC20TokenInformation(tokenInfo)
    } else {
      throw new DVFError('LEDGER_TOKENINFO_ERR')
    }
    transferTokenAddress = transferTokenAddress.substr(2)
  } else {
    transferTokenAddress = null
  }

  const starkSignature = (
    await eth.starkSignTransfer(
      path,
      transferTokenAddress,
      transferQuantization,
      starkKey,
      sourceVault,
      destinationVault,
      amountTransfer,
      nonce,
      timestamp
    )
  ).toString('hex')

  return { starkKey, starkSignature }
}
