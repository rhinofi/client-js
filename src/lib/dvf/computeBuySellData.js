const BN = require('../util/BN')
const toBN = require('../util/toBN')
const splitSymbol = require('./token/splitSymbol')

module.exports = (dvf, { symbol, amount, price, feeRate }) => {
  amount = toBN(amount)
  price = toBN(price)

  if (amount.isEqualTo(0)) throw new Error('amount cannot be 0')
  if (price.isLessThan(0)) throw new Error('price has to be greater than 0')

  const [ baseToken, quoteToken ] = splitSymbol(symbol)
  const absAmount = amount.absoluteValue()

  const base = {
    token: baseToken,
    amount: absAmount
  }

  const quote = {
    token: quoteToken,
    amount: absAmount.times(price)
  }

  const [ buy, sell ] = amount.isGreaterThan(0)
    ? [ base, quote ]
    : [ quote, base ]

  const sellTokenReg = dvf.token.getTokenInfo(sell.token)
  const buyTokenReg = dvf.token.getTokenInfo(buy.token)
  // console.log({sellTokenReg, buyTokenReg})
  const amountBuy = BN(10)
    .pow(buyTokenReg.decimals)
    .times(buy.amount)
    .dividedBy(buyTokenReg.quantization)
    .times(1 + (buyTokenReg.settleSpread || 0))
    .times(1 - feeRate)
    .integerValue()
    .toString()

  const amountSell = BN(10)
    .pow(sellTokenReg.decimals)
    .times(sell.amount)
    .dividedBy(sellTokenReg.quantization)
    .times(1 + (sellTokenReg.settleSpread || 0))
    .integerValue(BN.ROUND_DOWN)
    .toString()

  return {
    amountSell,
    amountBuy,
    tokenSell: sell.token,
    tokenBuy: buy.token
  }
}
