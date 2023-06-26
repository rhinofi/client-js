#!/usr/bin/env -S yarn node

const P = require('@rhino.fi/aigle')

const request = require('./request')

module.exports = useTor => P.retry(
  { times: 10, interval: 100 },
  () => request(useTor, 'http://ifconfig.me')
)
.then(r => console.log('current IP is:', r.body))
.catch(error => console.error(
  'error while obtaining current IP:', error.message || error.error
))
