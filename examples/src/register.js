const keyPair = await rhinofi.stark.createKeyPair(starkPrivKey)

const registerResponse = await rhinofi.register(keyPair.starkPublicKey)

logExampleResult(registerResponse)
