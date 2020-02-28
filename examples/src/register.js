const keyPair = await dvf.stark.createKeyPair(starkPrivKey)
const preRegisterResponse = await dvf.preRegister(keyPair.starkPublicKey)

const registerResponse = await dvf.register(
  keyPair.starkPublicKey,
  preRegisterResponse.deFiSignature
)

console.log("register response ->", registerResponse)
