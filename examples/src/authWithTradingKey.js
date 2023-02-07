rhinofi.config.useTradingKey = true

const nonce = Date.now() / 1000
const keyPair = sw.ec.keyFromPrivate(starkPrivKey, 'hex')
const starkSignature = sw.sign(keyPair, nonce)

const getDepositsResponse = await rhinofi.getDeposits(null, nonce, starkSignature)

logExampleResult(getDepositsResponse)