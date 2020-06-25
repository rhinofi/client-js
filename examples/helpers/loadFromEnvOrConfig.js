fs = require('fs')


const getConfigVar = (varName, config) => {
  const value = process.env[ varName ] || config[ varName ]

  if (value) {
    return value
  }
  else {
    throw new Error(
      `${varName} is required. Set it in ./config.json or via an env var.`
    )
  }

}


module.exports = () => {

  let config = {}

  try {
    config = JSON.parse(
      fs.readFileSync(`${__dirname}/../config.json`).toString()
    )
  }
  catch (error) {
    if (error.code == 'ENOENT') {
      console.log('warning: ./config.json not found')
    }
    else {
      throw error
    }
  }

  return {
    INFURA_PROJECT_ID: getConfigVar('INFURA_PROJECT_ID', config),
    ETH_PRIVATE_KEY: getConfigVar('ETH_PRIVATE_KEY', config)
  }
}
