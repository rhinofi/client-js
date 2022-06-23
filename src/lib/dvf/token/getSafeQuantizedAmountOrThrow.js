
const { Long, toQuantizedAmountBN, fromQuantizedToBaseUnitsBN } = require('dvf-utils')

module.exports = (baseUnitAmount, tokenInfo) => {
  const quantisedAmount = toQuantizedAmountBN(tokenInfo, baseUnitAmount)

  if (quantisedAmount.eq(0)) {
    return quantisedAmount
  }

  if (quantisedAmount.isLessThan(1)) {
    throw new Error(
      `Amount too small, got: ${baseUnitAmount}, allowed minumum: ` +
      `${fromQuantizedToBaseUnitsBN(tokenInfo, 1)}`
    )
  }

  if (quantisedAmount.isGreaterThan(Long.MAX_VALUE)) {
    throw new Error(
      `Amount too large, got: ${baseUnitAmount} allowed minumum: ` +
      `${fromQuantizedToBaseUnitsBN(tokenInfo, Long.MAX_VALUE)}`
    )
  }

  return quantisedAmount
}
