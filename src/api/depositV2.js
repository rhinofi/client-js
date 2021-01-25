const DVFError = require('../lib/dvf/DVFError')

const { fromQuantizedToBaseUnitsBN } = require('dvf-utils')

const postDeposit = require('../lib/dvf/makeDepositOrWithdrawV2ApiMethod')('deposit')
const contractDepositFromStarkTx = require('./contract/depositFromStarkTx')

module.exports = async (dvf, data, nonce, signature) => {
  const httpDeposit = await postDeposit(dvf, data, nonce, signature)

  const { token, tx } = httpDeposit

  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)

  await dvf.contract.approve(
    token,
    fromQuantizedToBaseUnitsBN(tokenInfo, tx.amount).toString()
  )

  const onChainDeposit = await contractDepositFromStarkTx(dvf, tx)

  if (!onChainDeposit.status) {
    throw new DVFError('ERR_ONCHAIN_DEPOSIT', {
      httpDeposit,
      onChainDeposit
    })
  }

  return { ...httpDeposit, transactionHash: onChainDeposit.transactionHash }
}
