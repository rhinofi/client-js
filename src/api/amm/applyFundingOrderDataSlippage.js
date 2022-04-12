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

  if (slippage > 1) {
    throw new Error('Slippage is a % between 0 - 1')
  }

  // If withdrawal:
  // Reduce token0 and token1
  // If deposit
  // Reduce LP tokens
  // In both cases, amountBuy for each order will be reduced
  const { orders } = validatedData
  const ordersPostSlippage = R.map(
    (order) =>
      R.assocPath(
        amountBuyPath,
        reduceBySlippage(R.path(amountBuyPath, order), slippage),
        order
      )
  )(orders)

  const appliedData = R.assoc('orders', ordersPostSlippage)(validatedData)

  return appliedData
}

/**
 * @type { (amount: string, slippage: Number) => string }
 */
const reduceBySlippage = (amount, slippage) =>
  toBN(amount).times(1 - slippage).integerValue().toFixed(0)
