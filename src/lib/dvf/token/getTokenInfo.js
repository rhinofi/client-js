module.exports = (dvf, token) => {
  if (token === 'USD') {
    token = 'USDT'
  }
  
  return dvf.config.tokenRegistry[token]
}
