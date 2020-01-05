const errorReasons = require('../error/reasons')

const isAddress = string => /([0-9abcdefABCDEF]){40}/.test(string)

module.exports = (dvf, ethAdress) => {
  if (!ethAdress) {
    return {
      error: 'ERR_ETH_ADDRESS_MISSING',
      reason: errorReasons.ERR_ETH_ADDRESS_MISSING
    }
  }

  if (!isAddress(ethAdress)) {
    return {
      error: 'ERR_INVALID_ETH_ADDRESS',
      reason: errorReasons.ERR_INVALID_ETH_ADDRESS
    }
  }
}
