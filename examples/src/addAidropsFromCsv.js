const fs = require('fs')
const { map } = require('lodash/fp')

const readFromCsv = (path) => {
  const data = fs.readFileSync(path, 'utf8')
  const splitData = data.split(/\r?\n/)
  const airdrops = map(([user, token, amount]) => ({
    user, token, amount
  }))(splitData)

  return airdrops
}

const path = process.argv[process.argv.length - 1]
if (!path) {
  console.error('No CSV file path passed')
  throw new Error('No CSV file')
}

const airdrops = readFromCsv(path)

console.log(`Adding ${airdrops.length} airdrops`)

const response = await dvf.addAirdrops(airdrops)

logExampleResult(response)
