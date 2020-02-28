module.exports = (dvf, contents) => {
  return {
    // headers: new window.Headers(),
    // mode: 'cors',
    // cache: 'default'
    json: JSON.stringify({contents})
  }
}
