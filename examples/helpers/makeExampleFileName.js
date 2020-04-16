module.exports = (exampleName, index) => {
  // Offset by 1 since example 00 is reserved for the setup script.
  const idx = index + 1
  const indexString = idx < 10 ? `0${idx}` : idx.toString()
  return `${indexString}.${exampleName}.js`
}