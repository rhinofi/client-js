const request = require('./request')
const envVars = require('./loadFromEnvOrConfig')()

const getPriceFromOrderBook = async () => {
  try {

    const args = {
      uri: 'https://api.stg.deversifi.com/bfx/v2/tickers?symbols=tETHUST',
      method: 'GET',
      json: true
    }

    const res = await request(envVars.useTor, args)

    let data = res && res.response && res.response.body || []

    if (!data.length || !data[0] || !data[0][1]) {
      console.log("Error getting order book from api")
      return null;
    }

    return data[0][1]
  } catch (e) {
    return null
  }
};


module.exports = getPriceFromOrderBook;
