const reasons = require('../error/reasons')

/*
  1. Can return multiple errors (need to modify)
  2. Can handle error functions
*/
module.exports = async (args) => {
  let efx = args.splice(0, 1)
  let error

  for (let objVal of args) {
    let { key, value, conditions } = objVal
    for (let cond of conditions) {
      if (typeof cond !== 'string') {
        error = await cond(value)
        if (error) error = `${key} - ` + error
        else error = null
      }
      switch (cond) {
        case 'is_empty':
          if (!value) error = `${key} - ERR_EMPTY`
          break
        case 'is_invalid':
          if (typeof value !== 'string' && value <= 0) error = `${key} - ERR_INVALID`
          break
      }
      if (error) break
    }
    if (error) break
  }

  return { error }
}
