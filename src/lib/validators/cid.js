const DVFError = require('../dvf/DVFError')

module.exports = (dvf, cid) => {
  if (!cid) {
    throw new DVFError('ERR_INVALID_CID')
  }
}
