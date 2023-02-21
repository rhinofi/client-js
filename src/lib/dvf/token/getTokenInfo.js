const bfxTodvf = require('@rhino.fi/dvf-utils').BfxToDvfToken

// TODO: Deprecated
module.exports = (dvf, token) => {
  const tokenInfo = dvf.config.tokenRegistry[bfxTodvf(token)]
  // Returning the symbol along with the info
  if (tokenInfo) {
    return {token, ...tokenInfo}
  }
}
