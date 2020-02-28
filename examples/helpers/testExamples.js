fp = require('lodash/fp');

const examples = require('./examplesList')
const makeExampleFileName = require('./makeExampleFileName')
const spawnProcess = require('./spawnProcess')

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID

if (!INFURA_PROJECT_ID) {
  throw new Error('INFURA_PROJECT_ID env var needs to be set to run the tests')
}

const examplesDir = `${__dirname}/..`

const testExample = async (fileName) => {
  console.log(`\nrunning test: ${fileName}\n`)

  const { waitForCleanExit, waitForLog } = await spawnProcess({
    command: [ `${examplesDir}/${fileName}` ],
    cwd: examplesDir,
    log: true,
    // debug: true
  })

  const timeout = 60000

  return Promise.all([
    waitForLog({match:/.*response ->*/, timeout}),
    waitForCleanExit(timeout)
  ])
}

// List of examples to skip when running tests.
const examplesToSkip = [
  // 'register'
]

;(async () => {

  const { waitForCleanExit } = await spawnProcess({
    command: [ `${examplesDir}/00.setup.js`, INFURA_PROJECT_ID ],
    cwd: examplesDir,
    log: true,
    env: Object.assign(
      {
        CREATE_NEW_ACCOUNT: 'true',
        WAIT_FOR_BALANCE: 'true'
      },
      { ...process.env }
    )
    // debug: true
  })

  await waitForCleanExit(4 * 60000)

  const exampleFileNames = examples.map(makeExampleFileName)
  const someExampleFileNames = fp.reject(
    (name) => fp.some(
      nameToSkip => name.match(nameToSkip),
      examplesToSkip
    ),
    exampleFileNames
  )

  console.log('exampleFileNames', exampleFileNames)
  console.log('someExampleFileNames', someExampleFileNames)

  for (const exampleName of someExampleFileNames) {
    await testExample(exampleName)
  }
})()
.catch(error => {
  console.error(error)
  process.exit(1)
})

// files.forEach((fileName) => {
//   renderAndSave(fs.readFileSync(`${examplesSrcDir}/${fileName}`).toString())
// })