dvf.config.useTradingKey = true

const nonce = Date.now() / 1000
const keyPair = sw.ec.keyFromPrivate(starkPrivKey, 'hex')
const starkSignature = sw.sign(keyPair, nonce)

const getDepositsResponse = await dvf.getDeposits(null, nonce, starkSignature)

logExampleResult(getDepositsResponse)