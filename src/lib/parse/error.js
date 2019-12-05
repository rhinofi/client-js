const reasons = require('../error/reasons')

module.exports = (errorArray) => {

  // get the last word from the error
  const message = errorArray[2].split(" ").pop()

  let error = {
    code: errorArray[1],
    message: errorArray[2]
  }

  for(let message in reasons){
    if(error.message == message){
      error.reason = reasons[message].trim()
    }
  }

  return {error}
}
