const BN = require('./BN')

module.exports = value => {
  // BN will call toString on values which types it doesn't recognize to
  // passing Decimal128 and Long is safe since both have appropriate toString
  // method
  const result = BN(value)

  if (result.isNaN()) {
    throw new Error(
      `cannot convert given value to BN, value: ${value}`
    )
  }

  return result
}
