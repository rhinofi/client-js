const path = require('path')
const fs = require('fs')

// compiling contracts
const solc = require('solc')

const CONTRACTS_PATH = path.join(__dirname, '../contracts/')

/**
 * Compile all .sol files in this folder and save them as .js
 */

const compile = async (filename) => {
  filename = filename.replace('.sol', '')

  const filePath = path.join(CONTRACTS_PATH, filename + '.sol')
  const source = fs.readFileSync(filePath, 'utf-8')

  // grabs the contract reference
  const compiled = solc.compile(source, 1)

  const contract = compiled.contracts[':' + filename]

  if (contract) {
    console.log('  OK!')
  }

  if (compiled.errors) {
    if (contract) {
      console.log('warnings:')
    } else {
      console.log('errors:')
    }

    console.log(compiled.errors)
  }

  if (!contract) return

  fs.writeFileSync(filePath + '.json', JSON.stringify(contract))
}

const allFiles = fs.readdirSync(CONTRACTS_PATH)
// grab all filename ending with .sol
const files = allFiles.filter((file) => /\.sol$/.test(file))

for (var file of files) {
  compile(file)
}
