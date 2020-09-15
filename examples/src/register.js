const keyPair = await dvf.stark.createKeyPair(starkPrivKey)

const registerResponse = await dvf.register(keyPair.starkPublicKey)

logExampleResult(registerResponse)
