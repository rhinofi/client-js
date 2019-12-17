const { post } = require('request-promise')

module.exports = async (efx, token) => {
  if (!token) {
    throw new Error('token is missing')
  }

  const nonce=Date.now() / 1000 + 30 + ''
  const signature = await efx.sign(nonce.toString(16))
  const data = {
    nonce,
    signature,
    token
  }
  //console.log('data is ', data)
  const url = efx.config.api + '/r/getBalance'
  //const url= 'http://localhost:7777/v1/trading/r/getBalance'
  console.log(`about to call dvf pub api for getBalance`)
  return post(url, { json: data })
}
