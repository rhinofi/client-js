const fs = require('fs');

Mustache = require('mustache')

const examplesSrcDir = `${__dirname}/../src`
const outputDir = `${__dirname}/..`
const exampleTemplate = fs.readFileSync(`${__dirname}/example.js.tmpl`).toString()
const methodWithNoArgsTemplate = fs.readFileSync(`${__dirname}/methodWithNoArgsTemplate.js.tmpl`).toString()
const files = fs.readdirSync(examplesSrcDir)
const makeExampleFileName = require('./makeExampleFileName')

const examples = require('./examplesList')

const renderAndSave = (src, fileName) => {
  const srcIndented = src.split('\n')
    .map((line) => line != '' ? '  ' + line : line)
    .join('\n')

  const rendered = Mustache.render(exampleTemplate, {
    EXAMPLE_SRC: srcIndented
  })

  const outFilePath = `${outputDir}/${fileName}`

  fs.writeFileSync(outFilePath, rendered)

  // Mark as executable
  const mode = fs.statSync(outFilePath).mode |
    fs.constants.S_IXUSR |
    fs.constants.S_IXGRP |
    fs.constants.S_IXOTH

  fs.chmodSync(outFilePath, mode)
}

examples.forEach((exampleName, index) => {
  const inFilePath = `${examplesSrcDir}/${exampleName}.js`
  const outFileName = makeExampleFileName(exampleName, index)

  const src = fs.existsSync(inFilePath) ?
    fs.readFileSync(inFilePath).toString() :
    Mustache.render(methodWithNoArgsTemplate, { METHOD_NAME: exampleName })

  renderAndSave(src, outFileName)
})

// files.forEach((fileName) => {
//   renderAndSave(fs.readFileSync(`${examplesSrcDir}/${fileName}`).toString())
// })