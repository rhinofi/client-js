const DVFError = require('../lib/dvf/DVFError')

const { fromQuantizedToBaseUnitsBN, toQuantizedAmountBN } = require('dvf-utils')

const contractDepositFromStarkTx = require('./contract/depositFromStarkTx')
const getVaultId = require('./getVaultId')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, { token, amount }, nonce, signature) => {
  validateAssertions(dvf, { token, amount })

  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
  const quantisedAmount = toQuantizedAmountBN(tokenInfo, amount)
  const vaultId = await getVaultId(dvf, token, nonce, signature)

  const { starkKeyHex } = dvf.config
  const tx = {
    vaultId,
    tokenId: tokenInfo.starkTokenId,
    starkKey: starkKeyHex,
    amount: quantisedAmount
  }

  await dvf.contract.approve(
    token,
    fromQuantizedToBaseUnitsBN(tokenInfo, quantisedAmount).toString()
  )

  const onChainDeposit = await contractDepositFromStarkTx(dvf, tx)

  if (!onChainDeposit.status) {
    throw new DVFError('ERR_ONCHAIN_DEPOSIT', {
      onChainDeposit
    })
  }

  return { transactionHash: onChainDeposit.transactionHash }
}
