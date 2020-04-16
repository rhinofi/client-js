const fs = require('fs');

fp = require('lodash/fp')
const P = require('aigle')

const spawnProcess = require('./spawnProcess')

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID
const configFileName = 'config-tmp.json'

if (!INFURA_PROJECT_ID) {
  throw new Error('INFURA_PROJECT_ID env var needs to be set')
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const accountsCount = Number(process.argv[2])
const outDir = `${__dirname}/${process.argv[3] || '.'}`
const startIndex = Number(process.argv[4] || 0)
const examplesDir = `${__dirname}/..`

const createAccount = async (index) => {
  const { waitForCleanExit } = await spawnProcess({
    command: [ `${examplesDir}/00.setup.js`, INFURA_PROJECT_ID ],
    cwd: examplesDir,
    log: true,
    env: Object.assign(
      { CONFIG_FILE_NAME: configFileName },
      { ...process.env },
      {
        CREATE_NEW_ACCOUNT: 'true'
      }
    )
    // debug: true
  })

  await waitForCleanExit(4 * 60000)

  const config = JSON.parse(fs.readFileSync(`${examplesDir}/${configFileName}`))
  console.log('config', config)
  const paddedIndex = pad(index, (accountsCount + startIndex).toString().length + 1)
  const outName = `eth-account-${paddedIndex}.json`
  const outPath = `${outDir}/${outName}`
  console.log('outPath', outPath)

  fs.writeFileSync(
    outPath,
    JSON.stringify(config.account, null, 2)
  )
}

;(async () => {
  for (const index of Array(accountsCount).keys()) {
    const idx = index + startIndex
    console.log('processing index', idx)
    await P.retry(
      { times: 5, interval: 1000 },
      () => createAccount(idx)
    )
  }
})()
.catch(error => {
  console.error(error)
  process.exit(1)
})
