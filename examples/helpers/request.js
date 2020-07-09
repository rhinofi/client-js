const rq = require('request')
const tr = require('tor-request')

const request = (useTor, arg) => new Promise((resolve, reject) => {
  const request = useTor ? tr.request.bind(tr) : rq

  return request(arg, (error, response, body) => {
    if (error || response.statusCode >= 400) {
      reject({error, response, body})
    }
    else {
      resolve({response, body})
    }
  })
})

module.exports = request