module.exports = async (dvf, nonce, signature) => {
  const exchangeUserConf = await dvf.getUserConfigFromServer(nonce, signature)

  Object.assign(dvf.config, exchangeUserConf)

  return exchangeUserConf
}
