const Transport = require('@ledgerhq/hw-transport-node-hid').default
const Eth = require('@ledgerhq/hw-app-eth').default
const byContractAddress = require('@ledgerhq/hw-app-eth/erc20')
  .byContractAddress
const DVFError = require('../../dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (
  dvf,
  path,
  token,
  amount,
  sourceVault, // number ID of the source vault
  destinationVault // number ID of the destination vault
) => {
  const currency = dvf.token.getTokenInfo(token)
  // console.log({ currency })
  const nonce = dvf.util.generateRandomNonce()
  let transferTokenAddress = currency.tokenAddress
  const transferQuantization = new BN(currency.quantization)
  const amountTransfer = new BN(dvf.token.toBaseUnitAmount(token, amount))
  expireTime =
    Math.floor(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  const transport = await Transport.create()
  const eth = new Eth(transport)
  const starkKey = (await eth.starkGetPublicKey(path)).toString('hex')
  console.log({ transferTokenAddress })
  if (transferTokenAddress) {
    let tokenInfo
    tokenInfo = byContractAddress(transferTokenAddress)
    transferTokenAddress = transferTokenAddress.substr(2)
    if (tokenInfo) {
      await eth.provideERC20TokenInformation(tokenInfo)
    } else {
      console.log('no tokenInfo')
      // TODO: Remove this for live
      // console.log('error ', error)
      // throw new DVFError('LEDGER_TOKENINFO_ERR')
      tokenInfo = {}
      tokenInfo['data'] = Buffer.from(
        `00${transferTokenAddress}0000000000000000`,
        'hex'
      )
      await eth.provideERC20TokenInformation(tokenInfo)
    }
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
      expireTime
    )
  ).toString('hex')

  transport.close()
  const starkPublicKey = { x: starkKey }
  starkTransferData = { starkPublicKey, nonce, expireTime, starkSignature }
  return starkTransferData
}
