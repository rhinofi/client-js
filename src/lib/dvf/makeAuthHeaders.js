const makeEcRecoverHeader = data => {
  const bufferStarkAuthData = Buffer.from(JSON.stringify(data))
  return 'EcRecover ' + bufferStarkAuthData.toString('base64')
}

module.exports = (dvf, nonce, signature) => {
  if (!nonce) throw new Error('nonce is required')
  if (!signature) throw new Error('signature is required')

  const authData = {
    signature,
    nonce,
    ...(dvf.config.useSignature
      ? { ethAddress: dvf.get('account') }
      : {}
    )
  }

  return { Authorization: makeEcRecoverHeader(authData) }
}
