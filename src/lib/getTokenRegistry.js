module.exports = (dvf, token) => {
  if (token === 'USDT') {
    token = 'USD'
  }
  return dvf.config.tokenRegistry[token]
}
