const fs = require('fs')

module.exports = (filePath, content, stringifyOpts = [null, 2 ]) => {
  return fs.writeFileSync(
    filePath,
    JSON.stringify.apply(JSON, [content].concat(stringifyOpts))
  )
}