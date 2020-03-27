const Eth = require('@ledgerhq/hw-app-eth').default
const byContractAddress = require('@ledgerhq/hw-app-eth/erc20')
  .byContractAddress
const DVFError = require('../../dvf/DVFError')
const BN = require('bignumber.js')
const ethUtil = require('ethereumjs-util')
const selectTransport = require('../../ledger/selectTransport')

module.exports = async (
  dvf,
  path,
  token,
  amount,
  sourceVault,
  destinationVault
) => {
  const Transport = selectTransport(dvf.isBrowser)
  const currency = dvf.token.getTokenInfo(token)
  const nonce = dvf.util.generateRandomNonce()
  let transferTokenAddress = currency.tokenAddress
  const transferQuantization = new BN(currency.quantization)
  const amountTransfer = new BN(dvf.token.toQuantizedAmount(token, amount))

  expireTime =
    Math.floor(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  const transport = await Transport.create()
  const eth = new Eth(transport)
  const tempKey = (await eth.starkGetPublicKey(path)).toString('hex')
  const starkPublicKey = {
    x: tempKey.substr(2, 64),
    y: tempKey.substr(66)
  }

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

  const rpcSignature = await eth.starkSignTransfer(
    path,
    transferTokenAddress,
    transferQuantization,
    starkPublicKey.x,
    sourceVault,
    destinationVault,
    amountTransfer,
    nonce,
    expireTime
  )

  const starkSignature = {
    r: rpcSignature.r,
    s: rpcSignature.s
  }
  // console.log({ starkSignature })
  transport.close()

  starkTransferData = { starkPublicKey, nonce, expireTime, starkSignature }

  return starkTransferData
}
