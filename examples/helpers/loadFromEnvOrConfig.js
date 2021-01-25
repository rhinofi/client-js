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

  const apiUrl = getConfigVar('API_URL', 'https://api.stg.deversifi.com')
  const ETH_PRIVATE_KEY = getConfigVar('ETH_PRIVATE_KEY')

  return {
    INFURA_PROJECT_ID: getConfigVar('INFURA_PROJECT_ID'),
    ETH_PRIVATE_KEY,
    STARK_PRIVATE_KEY: getConfigVar('STARK_PRIVATE_KEY', ETH_PRIVATE_KEY),
    API_URL: apiUrl,
    DATA_API_URL: getConfigVar('DATA_API_URL', apiUrl)
  }
}
