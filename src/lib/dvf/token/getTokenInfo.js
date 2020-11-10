const bfxTodvf = require('dvf-utils').BfxToDvfToken

module.exports = (dvf, token) => {
  return dvf.config.tokenRegistry[bfxTodvf(token)]
}
