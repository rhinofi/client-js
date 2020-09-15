const path = require('path')
const saveAsJson = require('./saveAsJson')

module.exports = exampleFilename => content => {
  const resultsDir = process.env.SAVE_EXAMPLE_RESULTS_TO_DIR

  const { name, base } = path.parse(exampleFilename)

  if (resultsDir) {
    fs.mkdirSync(resultsDir, { recursive: true })

    saveAsJson(path.join(resultsDir, `${name}.json`), content)
  }

  console.log(`${base} response ->`, content)
}
