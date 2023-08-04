const { starkKeyHex, ethAddress } = await rhinofi.getUserConfig()

const l1RegistrationSignature = await rhinofi.stark.signRegistration(
  ethAddress
)

const callData = await rhinofi.stark.l1RegistrationCallData(
  starkKeyHex,
  ethAddress,
  l1RegistrationSignature
)

logExampleResult({
  ethAddress,
  starkKeyHex,
  sig: l1RegistrationSignature,
  callData
})