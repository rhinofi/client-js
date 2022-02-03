const fs = require('fs')
const path = require('path')

const getConfigVar_ = (config, configFileName) => (varName, defaultValue) => {
  const value = process.env[ varName ] || config[ varName ] || defaultValue

  if (value) {
    return value
  }
  else {
    throw new Error(
      `${varName} is required. Set it in ${configFileName} or via an env var.`
    )
  }
}

module.exports = (configFileName = 'config.json') => {
  const configFilePath = path.normalize(
    path.join(__dirname, '..', configFileName)
  )

  let config = {}

  try {
    config = JSON.parse(
      fs.readFileSync(configFilePath).toString()
    )
  }
  catch (error) {
    if (error.code == 'ENOENT') {
      console.log(`warning: ${configFilePath} not found`)
    }
    else {
      throw error
    }
  }

  const getConfigVar = getConfigVar_(config, configFilePath)

  const apiUrl = getConfigVar('API_URL', 'https://rpc.gateway.fm/v1/starkex/stg')
  const apiKey = getConfigVar('API_KEY', 'MISSING_API_KEY')
  const ETH_PRIVATE_KEY = getConfigVar('ETH_PRIVATE_KEY')

  return {
    RPC_URL: getConfigVar('RPC_URL'),
    ETH_PRIVATE_KEY,
    STARK_PRIVATE_KEY: getConfigVar('STARK_PRIVATE_KEY', ETH_PRIVATE_KEY),
    API_URL: apiUrl,
    API_KEY: apiKey,
    DATA_API_URL: getConfigVar('DATA_API_URL', apiUrl)
  }
}
