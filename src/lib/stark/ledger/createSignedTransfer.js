const Eth = require('@ledgerhq/hw-app-eth').default
const byContractAddress = require('@ledgerhq/hw-app-eth/erc20')
  .byContractAddress
const DVFError = require('../../dvf/DVFError')
const BN = require('bignumber.js')
const selectTransport = require('../../ledger/selectTransport')

module.exports = async (
  dvf,
  path,
  token,
  amount,
  sourceVault,
  destinationVault
) => {
  const starkPath = dvf.stark.ledger.getPath(path)
  const Transport = selectTransport(dvf.isBrowser)
  const currency = dvf.token.getTokenInfo(token)
  const nonce = dvf.util.generateRandomNonce()
  let transferTokenAddress = currency.tokenAddress
  const transferQuantization = new BN(currency.quantization)
  const amountTransfer = new BN(dvf.token.toQuantizedAmount(token, amount))

  const expireTime =
    Math.floor(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  const transport = await Transport.create()
  const eth = new Eth(transport)
  const tempKey = (await eth.starkGetPublicKey(starkPath)).toString('hex')
  const starkPublicKey = {
    x: tempKey.substr(2, 64),
    y: tempKey.substr(66)
  }

  if (transferTokenAddress) {
    const tokenInfo = byContractAddress(transferTokenAddress)
    transferTokenAddress = transferTokenAddress.substr(2)
    if (tokenInfo) {
      await eth.provideERC20TokenInformation(tokenInfo)
    } else {
      if (process.env.NODE_ENV === 'test') {
        let tokenInfo = {}
        tokenInfo['data'] = Buffer.from(
          `00${transferTokenAddress}0000000000000000`,
          'hex'
        )
        await eth.provideERC20TokenInformation(tokenInfo)
      } else {
        throw new DVFError('LEDGER_TOKENINFO_ERR')
      }
    }
  } else {
    transferTokenAddress = null
  }

  const starkSignature = await eth.starkSignTransfer(
    starkPath,
    transferTokenAddress,
    transferQuantization,
    starkPublicKey.x,
    sourceVault,
    destinationVault,
    amountTransfer,
    nonce,
    expireTime
  )

  // console.log({ starkSignature })
  transport.close()

  return { starkPublicKey, nonce, expireTime, starkSignature }
}
