fp = require('lodash/fp');

const { Joi } = require('dvf-utils')

const examples = require('./examplesList')
const makeExampleFileName = require('./makeExampleFileName')
const spawnProcess = require('./spawnProcess')

const configSchema = Joi.object().keys({
  RPC_URL: Joi.string().required(),
  SETUP_TIMEOUT: Joi.number().integer().default(10 * 60000),
  TEST_TIMEOUT: Joi.number().integer().default(10 * 60000),
  CONFIG_FILE_NAME: Joi.string().default(`config-test-${new Date().toISOString()}.js`),
  WAIT_FOR_DEPOSIT_READY: Joi.boolean().default(true),
  WAIT_FOR_BALANCE: Joi.boolean().default(true),
  CREATE_NEW_ACCOUNT: Joi.boolean().default(true)
})

const parsedEnv = Joi.attempt(
  process.env,
  configSchema,
  'error while parsing config from process.env',
  { allowUnknown: true, stripUnknown: false }
)

const examplesDir = `${__dirname}/..`

const testExample = async (fileName) => {
  console.log(`\nrunning test: ${fileName}\n`)

  const { waitForCleanExit, waitForLog } = await spawnProcess({
    command: [ `${examplesDir}/${fileName}` ],
    cwd: examplesDir,
    log: true,
    env: parsedEnv
    // debug: true
  })

  const timeout = parsedEnv.TEST_TIMEOUT

  return Promise.all([
    waitForLog({ match: new RegExp(`${fileName} response ->`), timeout }),
    waitForCleanExit(timeout)
  ])
}

// List of examples to skip when running tests.
const examplesToSkip = [
  'ledgerDeposit',
  'ledgerSubmitOrder',
  'ledgerSubmitOrder',
  'ledgerWithdraw',
  'fullWithdrawalRequest'
]

;(async () => {

  const { waitForCleanExit } = await spawnProcess({
    // Third arg is to avoid interactive prompt when using existing config
    command: [ `${examplesDir}/00.setup.js`, parsedEnv.RPC_URL, '--yes' ],
    cwd: examplesDir,
    log: true,
    env: parsedEnv
    // debug: true
  })

  await waitForCleanExit(parsedEnv.SETUP_TIMEOUT)

  const exampleFileNames = examples.map(makeExampleFileName)
  const someExampleFileNames = fp.reject(
    (name) => fp.some(
      nameToSkip => name.match(nameToSkip),
      examplesToSkip
    ),
    exampleFileNames
  )

  console.log('examples to test:', someExampleFileNames)

  for (const exampleName of someExampleFileNames) {
    await testExample(exampleName)
  }
})()
.catch(error => {
  console.error(error)
  process.exit(1)
})
