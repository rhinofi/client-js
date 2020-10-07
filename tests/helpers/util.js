
const sleep = async time => new Promise(resolve => setTimeout(resolve, time * 1000 || 10000));

module.exports = { 
  sleep
}
