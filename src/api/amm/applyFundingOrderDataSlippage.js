const R = require('ramda')
const validateWithJoi = require('../../lib/validators/validateWithJoi')
const { toBN } = require('dvf-utils')

const { fundOrderDataSchema } = require('./schemas')

const validateData = validateWithJoi(fundOrderDataSchema)('INVALID_METHOD_ARGUMENT')({
  context: 'applyFundingOrderDataSlippage'
})

const amountBuyPath = ['starkOrder', 'amountBuy']

module.exports = (dvf, data, slippage) => {
  const validatedData = validateData(data)

  if (slippage > 1 || slippage < 0) {
    throw new Error(`Slippage can only be 0 - 1 to represent 0 - 100%, provided: ${slippage}`)
  }

  // If withdrawal:
  // Reduce token0 and token1
  // If deposit
  // Reduce LP tokens
  // In both cases, amountBuy for each order will be reduced
  const { orders } = validatedData
  const ordersPostSlippage = R.map(
    R.over(
      R.lensPath(amountBuyPath),
      reduceBySlippage(slippage)
    )
  )(orders)

  const appliedData = R.assoc('orders', ordersPostSlippage)(validatedData)

  return appliedData
}

/**
 * @type { (slippage: Number) => (amount: string) => string }
 */
const reduceBySlippage = slippage => amount =>
  toBN(amount).times(1 - slippage).integerValue().toFixed(0)
