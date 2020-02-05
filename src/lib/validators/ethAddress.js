const DVFError = require('../dvf/DVFError')

const isAddress = string => /([0-9abcdefABCDEF]){40}/.test(string)

module.exports = (dvf, ethAdress) => {
  if (!ethAdress) {
    throw new DVFError('ERR_ETH_ADDRESS_MISSING')
  }

  if (!isAddress(ethAdress)) {
    throw new DVFError('ERR_INVALID_ETH_ADDRESS')
  }
}
